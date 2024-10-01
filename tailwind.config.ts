import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");
import type { PluginAPI } from "tailwindcss/types/config"; // Import the PluginAPI type

const config: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // theme: {
  //   // extend: {
  //   //   backgroundImage: {
  //   //     "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
  //   //     "gradient-conic":
  //   //       "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
  //   //   },
  //   // },
  // },
  // plugins: [],
  theme: {
    extend: {
      transform: {
        'preserve-3d': 'transform-style: preserve-3d;',
      },
      backfaceVisibility: {
        'hidden': 'backface-visibility: hidden;',
      },
      perspective: {
        '1000': 'perspective: 1000px;',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI ) {
      addUtilities({
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)',
        },
        '.hide-scrollbar': {
          /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // WebKit browsers
          },
        },
      });
    }
  ],
});

export default config;
