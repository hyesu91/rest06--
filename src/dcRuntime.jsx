import React from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// DC 템플릿 → React 렌더러
//
// 디자인 아티팩트(Claude dc-runtime)가 쓰던 템플릿 문법을 그대로 해석한다.
//   <sc-for list="{{ expr }}" as="m"> … </sc-for>   배열 반복
//   <sc-if value="{{ expr }}"> … </sc-if>           조건부 렌더
//   {{ expr }}                                        텍스트·속성값 보간
//   onclick="{{ handler }}"                           이벤트 → onClick
//   style="…"                                         인라인 style → 객체
//   style-hover="…"                                   마우스 호버 시 인라인 style 적용
//
// 표현식은 vals(렌더 데이터) + 반복 변수로 구성된 스코프에서 평가한다.
// ─────────────────────────────────────────────────────────────────────────────

const fnCache = new Map()
function compileExpr(expr) {
  let fn = fnCache.get(expr)
  if (!fn) {
    // with(scope) 로 vals/반복변수를 그대로 참조한다. 표현식은 신뢰된 템플릿 출처.
    // eslint-disable-next-line no-new-func
    fn = new Function('$s', `with($s){ return (${expr}); }`)
    fnCache.set(expr, fn)
  }
  return fn
}
function evalExpr(expr, scope) {
  try {
    return compileExpr(expr)(scope)
  } catch (e) {
    console.warn('[dc] expr 평가 실패:', expr, e?.message)
    return undefined
  }
}

// "{{ a }} foo {{ b }}" → 평가된 문자열. 전체가 단일 {{ }} 면 원시값(함수 등) 반환.
const INTERP = /\{\{([^}]*)\}\}/g
function interpolate(str, scope) {
  const m = str.match(/^\s*\{\{([^}]*)\}\}\s*$/)
  if (m) return evalExpr(m[1].trim(), scope) // 단일 표현식: 원시값 유지
  return str.replace(INTERP, (_, e) => {
    const v = evalExpr(e.trim(), scope)
    return v == null ? '' : String(v)
  })
}

// 인라인 CSS 문자열 → React style 객체. CSS 변수(--x)는 그대로 둔다.
function cssToStyle(css) {
  const out = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const rawKey = decl.slice(0, i).trim()
    const val = decl.slice(i + 1).trim()
    if (!rawKey) continue
    const key = rawKey.startsWith('--')
      ? rawKey
      : rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    out[key] = val
  }
  return out
}

// style-hover: "k:v; k2:v2" 쌍을 파싱해 enter 시 적용, leave 시 원복.
function makeHoverHandlers(hoverCss) {
  const pairs = []
  for (const decl of hoverCss.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    const v = decl.slice(i + 1).trim()
    if (k) pairs.push([k, v])
  }
  return {
    onMouseEnter: (e) => {
      const el = e.currentTarget
      el.__prevStyle = pairs.map(([k]) => [k, el.style.getPropertyValue(k)])
      for (const [k, v] of pairs) el.style.setProperty(k, v)
    },
    onMouseLeave: (e) => {
      const el = e.currentTarget
      for (const [k, v] of el.__prevStyle || pairs.map(([k]) => [k, ''])) {
        if (v) el.style.setProperty(k, v)
        else el.style.removeProperty(k)
      }
    },
  }
}

const EVENT_ATTR = { onclick: 'onClick', oninput: 'onInput', onchange: 'onChange', onsubmit: 'onSubmit', onkeydown: 'onKeyDown' }
const SKIP_ATTR = new Set(['list', 'as', 'value', 'hint-placeholder-count', 'hint-placeholder-val'])

function buildProps(el, scope, key) {
  const props = { key }
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name
    const raw = attr.value
    if (SKIP_ATTR.has(name)) continue
    if (EVENT_ATTR[name]) {
      const fn = interpolate(raw, scope)
      if (typeof fn === 'function') props[EVENT_ATTR[name]] = fn
      continue
    }
    if (name === 'style-hover') {
      Object.assign(props, makeHoverHandlers(raw))
      continue
    }
    const val = interpolate(raw, scope)
    if (name === 'style') props.style = cssToStyle(typeof val === 'string' ? val : '')
    else if (name === 'class') props.className = val
    else if (name === 'for') props.htmlFor = val
    else props[name] = val
  }
  return props
}

// 자식 노드들을 React children 배열로 변환.
function renderChildren(node, scope, keyBase) {
  const out = []
  let i = 0
  for (const child of Array.from(node.childNodes)) {
    const k = `${keyBase}.${i++}`
    if (child.nodeType === 3) {
      // 텍스트
      const text = child.nodeValue
      if (!text) continue
      if (text.includes('{{')) out.push(interpolate(text, scope))
      else out.push(text)
    } else if (child.nodeType === 1) {
      const r = renderElement(child, scope, k)
      if (Array.isArray(r)) out.push(...r)
      else if (r != null) out.push(r)
    }
  }
  return out
}

function renderElement(el, scope, key) {
  const tag = el.tagName.toLowerCase()

  if (tag === 'sc-for') {
    const listExpr = (el.getAttribute('list') || '').replace(/^\{\{|\}\}$/g, '').trim()
    const asName = el.getAttribute('as') || 'item'
    const list = evalExpr(listExpr, scope)
    if (!Array.isArray(list)) return []
    const out = []
    list.forEach((item, idx) => {
      const childScope = { ...scope, [asName]: item, [`${asName}_i`]: idx, $index: idx }
      out.push(...renderChildren(el, childScope, `${key}#${idx}`))
    })
    return out
  }

  if (tag === 'sc-if') {
    const valExpr = (el.getAttribute('value') || '').replace(/^\{\{|\}\}$/g, '').trim()
    const cond = evalExpr(valExpr, scope)
    if (!cond) return []
    return renderChildren(el, scope, key)
  }

  const props = buildProps(el, scope, key)
  const VOID = new Set(['img', 'br', 'hr', 'input', 'source', 'meta', 'link', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use', 'stop', 'ellipse'])
  if (VOID.has(tag)) return React.createElement(tag, props)
  const children = renderChildren(el, scope, key)
  return React.createElement(tag, props, ...children)
}

// 템플릿 문자열을 1회 파싱해 캐시한다.
const docCache = new Map()
function parseTemplate(html) {
  let body = docCache.get(html)
  if (!body) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    body = doc.body
    docCache.set(html, body)
  }
  return body
}

/** 템플릿 + 렌더 데이터(vals) → React 엘리먼트 트리 */
export function renderTemplate(templateHtml, vals) {
  const body = parseTemplate(templateHtml)
  const roots = renderChildren(body, vals, 'root')
  return React.createElement(React.Fragment, null, ...roots)
}
