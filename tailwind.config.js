/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                ivory: '#F6F1E7',
                beige: '#EAE2D4',
                ink: '#171512',
                stone: '#6E675D',
                gold: '#9A7C43',
                line: 'rgba(23,21,18,0.16)'
            },
            fontFamily: {
                serif: ['var(--font-heading)', 'Cormorant Garamond', 'Georgia', 'serif'],
                sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif']
            },
            maxWidth: {
                container: '1440px'
            },
            letterSpacing: {
                widest2: '0.28em'
            },
            transitionTimingFunction: {
                editorial: 'cubic-bezier(0.22, 1, 0.36, 1)'
            },
            boxShadow: {
                soft: '0 1px 2px rgba(23,21,18,0.06)'
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards'
            }
        }
    },
    plugins: []
};
