/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            container: {
                center: true,
                padding: '1rem',
                screens: {
                    sm: '900px',
                },
            },
        },
    },
    plugins: [],
}
