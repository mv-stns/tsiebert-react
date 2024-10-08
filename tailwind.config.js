/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx,jsx,js}", "./components/**/*.{ts,tsx,jsx,js}", "./app/**/*.{ts,tsx,jsx,js}", "./src/**/*.{ts,tsx,jsx,js}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontFamily: {
				"main": '"Editor\'s Note", serif'
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				// "marquee": {
				// 	"0%": { transform: "translateX(0%)" },
				// 	"100%": { transform: "translateX(-100%)" },
				// },
				// "marquee2": {
				// 	"0%": { transform: "translateX(0%)" },
				// 	"100%": { transform: "translateX(-100%)" },
				// },
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				marquee: (direction) => createMarqueeAnimation(direction),
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"marquee": "marquee 25s linear infinite",
				"marquee2": "marquee2 25s linear infinite",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/forms"),
	],
};

// custom function to create marquee animation
function createMarqueeAnimation(direction) {
	return {
		"0%": { transform: `translateX(0%)` },
		"100%": { transform: `translateX(-100%)` },
	};
}