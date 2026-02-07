/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'vibe-bg': '#0c0e14',
                'vibe-blue': '#00f2ff',
                'vibe-pink': '#ff00c8',
            },
            backgroundImage: {
                'vibe-gradient': 'linear-gradient(to right, #00f2ff, #ff00c8)',
            },
            backdropBlur: {
                'vibe': '16px',
            }
        },
    },
    plugins: [],
}
