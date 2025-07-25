// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // src 폴더를 사용한다면 이 줄도 포함되어야 합니다.
    './src/layouts/*.{js,ts,tsx,jsx,mdx}'
  ],
  theme: {
    extend: {
      // 이전에 추가했던 Shadcn/ui 관련 colors, borderRadius, keyframes, animation 등은
      // globals.css에서 해당 @theme, :root, @layer base 섹션을 주석 처리했으므로,
      // 이 부분은 그대로 두셔도 됩니다. Tailwind가 globals.css에서 해당 변수를 찾지 못하면 무시합니다.
      // 하지만 문제가 지속되면 이 부분도 임시로 제거해볼 수 있습니다.
    },
  },
  plugins: [
    // require('tw-animate-css'), // 이 줄은 제거된 상태여야 합니다.
  ],
};
export default config;