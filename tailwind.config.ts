/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 禁止 tailwind 的默认样式
    preflight: false
  }
}

