import { extendTheme, theme } from "@chakra-ui/react";

const colors = {
  "main-bg": "#0E1012",

  "white-text": "#E8E8EA",
  "subtle-text": "#9B9B9B",

  "column-bg": "#16181D",
  "column-header-bg": "#1A1D23",

  "card-bg": "#242731",
  "card-darker-bg": "#1a1c23",
  "card-border": "#2D313E",

  "edit-button": "#103fa5d6",
  "hover-edit-button": "#1348bbd6",
  "delete-button": "#a51010d6",
};

const fonts = {
  heading: "Poppins",
  body: "Poppins",
};

export default extendTheme({
  ...theme,
  colors,
  fonts,
});
