import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(rest06.dreamitbiz.com)에 배포 → base 는 루트('/').
// CNAME 은 public/ 에 두어 빌드 시 dist/ 로 복사한다.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
