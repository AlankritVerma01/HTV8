import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/(routes)/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      bm: "#0E0A1B",
      pp: "#5333EC",
      tt: "#32D3D8",
      white: "#FFFFFF",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        lato: ["var(--font-lato)"],
      },
    },
  },
  plugins: [],
};
export default config;
