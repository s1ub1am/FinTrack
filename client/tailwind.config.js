/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5', // Indigo 600
                secondary: '#10b981', // Emerald 500
                dark: '#1f2937', // Gray 800
            }
        },
    },
    plugins: [],
}
