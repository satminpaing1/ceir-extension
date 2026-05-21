/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ဒီစာကြောင်းက အရေးကြီးဆုံးပါ!!!
  content: [
    "./entrypoints/**/*.{html,ts,tsx}",
    "./components/**/*.{html,ts,tsx}",
    "./App.tsx", // အကယ်၍ ပင်မ App ဖိုင်က အပြင်မှာရှိရင်
    "./main.tsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
