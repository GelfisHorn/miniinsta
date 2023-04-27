/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				main: {
					black: '#111111',
					accent: '#ca38a5',
					'accent-variant': '#ff6240',
					'black-accent': '#101010',
				},
			},
			width: {
				box: 'min(90%, 500px)',
				form: 'min(90%, 400px)',
				banner: 'min(90%, 1000px)',
				profile: 'min(90%, 700px)',
			},
			height: {
				box: '500px',
			},
			gridTemplateColumns: {
				'main-layout': '270px auto',
			},
		},
	},
	plugins: [],
}
