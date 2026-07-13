/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: '#F7F6F2',
                surface: '#FFFFFF',
                ink: '#171717',
                'ink-soft': '#646464',
                border: '#DDDCD7',
                action: '#17233B',
                accent: '#C74747'
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Apple SD Gothic Neo"',
                    '"Pretendard Variable"',
                    'Pretendard',
                    '"Segoe UI"',
                    'Roboto',
                    '"Noto Sans KR"',
                    '"Malgun Gothic"',
                    'sans-serif'
                ]
            },
            maxWidth: {
                composer: '760px'
            },
            transitionDuration: {
                DEFAULT: '150ms'
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(4px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                'fade-in': 'fade-in 160ms ease-out'
            }
        }
    },
    plugins: []
};
