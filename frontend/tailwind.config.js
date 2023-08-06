/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    mode: process.env.NODE_ENV ? 'jit' : undefined,
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'background-gradient': "linear-gradient(to top, rgb(var(--color-primary-lighter)) 15%, rgba(255,255,255,0))",
                'game-gradient': "linear-gradient(to top, rgb(var(--color-primary-lighter)) 25%, rgba(255,255,255,0))",
                'main-gradient': "linear-gradient(to right, rgb(var(--color-primary-lighter) / 10), rgb(var(--color-primary-dark)))"
            },
            colors: {
                'primary-lighter': 'rgb(var(--color-primary-lighter) / <alpha-value>)',
                'primary-dark': 'rgb(var(--color-primary-dark) / <alpha-value>)',
                'secondary-light': 'rgb(var(--color-secondary-light) / <alpha-value>)',
                'secondary-dark': 'rgb(var(--color-secondary-dark) / <alpha-value>)'
            },
            gridTemplateColumns: {
                'app': '1fr 2fr 1fr',
                'main': '1fr 2fr 1fr'
            },
            dropShadow: {
                'header': '1px 1px 2px rgba(156, 138, 40, 1)',
                'header-dark': '1px 1px 2px rgba(224, 210, 135, 0.5)',
                'text-white-shadow': '1px 1px 1px rgba(255, 255, 255, 0.3)'
            },
            borderWidth: {
                '1': '1px'
            },
            height: {
                '22/25': '88%',
                '11/12': '92%'
            }
        },
    },
    plugins: [],
}
