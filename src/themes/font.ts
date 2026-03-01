import { width } from "./dimensions"

const fonts = {
  poppinsThin100: "Poppins-Thin",
  poppinsLight300: "Poppins-Light",
  poppinsMedium500: "Poppins-Medium",
  poppinsRegular400: "Poppins-Regular",
  poppinsSemiBold600: "Poppins-SemiBold",
  poppinsBold700: "Poppins-Bold",
  poppinsExtraBold800: "Poppins-ExtraBold",
}

const customWP = (percentage: number) => (width * percentage) / 100

const ResponsiveFonts = {
  px6: customWP(1.9),
  px7: customWP(2.1),
  px8: customWP(2.3),
  px10: customWP(2.7),
  px11: customWP(2.9),
  px12: customWP(3.1),
  px13: customWP(3.3),
  px14: customWP(3.5),
  px15: customWP(3.75),
  px16: customWP(4.0),
  px17: customWP(4.25),
  px18: customWP(4.5),
  px20: customWP(5.0),
  px22: customWP(5.3),
  px24: customWP(5.6),
  px26: customWP(5.75),
  px28: customWP(5.9),
  px30: customWP(6.2),
  px34: customWP(6.7),
  px36: customWP(8.5),
  px38: customWP(9.5),
  px40: customWP(10.5),
  px45: customWP(11.5),
  px50: customWP(12.5),
}

export { fonts, ResponsiveFonts }
