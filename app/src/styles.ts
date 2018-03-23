import * as csstips from "csstips";
import { color } from "csx";
import { classes, style } from "typestyle";

const primaryColorHex = "#4A90E2";
const primaryColorTextHex = "#FEFEFE";

namespace Colors {
  export const primary = color(primaryColorHex).toHexString();
  export const primaryDark = color(primaryColorHex)
    .darken(0.1)
    .toHexString();
  export const primaryDarker = color(primaryColorHex)
    .darken(0.2)
    .toHexString();
  export const primaryLight = color(primaryColorHex)
    .lighten(0.2)
    .toHexString();

  export const white = "#ffffff";

  export const green = "#8DBE7B";
  export const red = "#DA6464";
  export const grey = "#ccc";

  export const background = color("#97C4F8").lighten(0.18).toString();

  export const primaryText = color(primaryColorTextHex).toHexString();
}

namespace Shadows {
  export const one = "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";
  export const two = "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
}

namespace Classes {
  export const panel = style(
    {
      backgroundColor: "#fff",
      boxShadow: Shadows.one,
      margin: "5px 0",
      padding: "0 5px",
      textAlign: "center",
    },
    csstips.padding(5),
  );

  export const subheader = style({
    color: Colors.primary,
    fontSize: "14px",
    textAlign: "center",
    textTransform: "uppercase",
  }, csstips.padding(10))

  export const description = style({
    color: Colors.primary,
    textAlign: "center",
  }, csstips.padding(10))

  export const flexPad = style(csstips.flex);

  export const flexContainer = style(csstips.vertical, csstips.flex);

  export const buttonGroup = style(csstips.flexRoot, csstips.horizontallySpaced(10))
  export const buttonGroupVertical = style(csstips.vertical, csstips.verticallySpaced(10))
}

export { color, style, csstips, classes, Colors, Shadows, Classes };
