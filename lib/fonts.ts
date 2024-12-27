import localFont from "next/font/local";

// Default
export const Nexa = localFont({
  src: [
    {
      path: "../fonts/nexa-light.woff2",
      weight: "200",
    },
    {
      path: "../fonts/nexa-regular.woff2",
      weight: "400",
    },
    {
      path: "../fonts/nexa-bold.woff2",
      weight: "800",
    },
  ],

  style: "normal",
  display: "swap",
});

// "Familiada"
export const Dotted = localFont({
  src: "../fonts/familiada-regular.woff2",
  display: "swap",
});

// "Postaw Na Milion"
export const Myriad = localFont({
  src: [
    {
      path: "../fonts/myriad-pro-semibold.woff2",
      weight: "normal",
    },
    {
      path: "../fonts/myriad-pro-bold-cond.woff2",
      weight: "bold",
    },
  ],

  style: "normal",
  display: "swap",
});
