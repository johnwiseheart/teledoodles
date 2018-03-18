import * as csstips from "csstips";
import { color } from 'csx';
import { classes, style } from "typestyle";

const primaryColorHex = "#26A7FF";
const primaryColorTextHex = "#FEFEFE";

namespace Colors {
  export const primary = color(primaryColorHex).toHexString();
  export const primaryDark = color(primaryColorHex).darken(.1).toHexString();
  export const primaryDarker = color(primaryColorHex).darken(.2).toHexString();
  export const primaryLight = color(primaryColorHex).lighten(.2).toHexString();

  export const primaryText = color(primaryColorTextHex).toHexString();
}

namespace Shadows {
  export const one = "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";
  export const two = "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
}

namespace Classes {
  export const panel = style({
    backgroundColor: '#fff',
    boxShadow: Shadows.one,
    margin: "5px 0",
    padding: "0 5px",
    textAlign: "center",
  }, csstips.padding(5));

  export const flexPad = style(csstips.flex);

  export const flexContainer = style(csstips.vertical, csstips.flex);
}

export { color, style, csstips, classes, Colors, Shadows, Classes };