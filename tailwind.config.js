/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#0a0d1a',
                accent: '#FF4500',
                'accent-light': '#FF8C00',
                'text-primary': '#FFFFFF',
                'text-secondary': '#A0A8B8',
                'card-bg': '#0f1225',
                'card-border': '#1a1f35',
            },
            fontFamily: {
                syne: ['Syne', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'spin-slow': 'spin 20s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(255,69,0,0.4)' },
                    '50%': { boxShadow: '0 0 35px rgba(255,69,0,0.8)' },
                },
            },
            maxWidth: {
                '8xl': '1400px',
            },
        },
    },
    plugins: [],
}
