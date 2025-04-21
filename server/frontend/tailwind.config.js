/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "minecraft-bg": "url('/minecraftBg.webp')",
            },
        },
    },
    plugins: [],
};
