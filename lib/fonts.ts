import localFont from "next/font/local";

// Default
export const Nexa = localFont({
  src: [
    {
      path: "../fonts/nexa_light.woff2",
      weight: "200",
    },
    {
      path: "../fonts/nexa_regular.woff2",
      weight: "400",
    },
    {
      path: "../fonts/nexa_bold.woff2",
      weight: "800",
    },
  ],

  style: "normal",
  display: "swap",
});

// "Familiada"
export const Dotted = localFont({
  src: "../fonts/familiada_regular.woff2",
  display: "swap",
});

// "Postaw Na Milion"
export const Myriad = localFont({
  src: [
    {
      path: "../fonts/myriad_pro_semibold.woff2",
      weight: "normal",
    },
    {
      path: "../fonts/myriad_pro_bold_cond.woff2",
      weight: "bold",
    },
  ],

  style: "normal",
  display: "swap",
});
