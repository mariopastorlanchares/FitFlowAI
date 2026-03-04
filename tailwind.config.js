const { palette } = require('./constants/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: palette.background,
        surface: palette.surface,
        primary: palette.primary,
        danger: palette.danger,
        success: palette.success,
      },
      textColor: {
        DEFAULT: palette.textPrimary,
        secondary: palette.textSecondary,
      },
      borderColor: {
        DEFAULT: palette.border,
      },
    },
  },
  plugins: [],
};