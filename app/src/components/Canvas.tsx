import * as React from "react";
import * as Iconicon from "react-ionicons";
import { color, Colors, csstips, Shadows, style } from "../styles";
import { sendToS3 } from "../utils";

interface IPoint {
  x: number;
  y: number;
}

export interface ICanvasProps {
  onCanvasChange?: (isEmpty: boolean) => void;
}

export class Canvas extends React.Component<ICanvasProps, {}> {
  private isDrawing = false;
  private prevMouse: IPoint;
  private currMouse: IPoint;

  private canvas: HTMLCanvasElement;
  private canvasContainer: HTMLDivElement;
  private refHandlers = {
    canvas: (canvasElement: HTMLCanvasElement) => {
      this.canvas = canvasElement;
    },
    canvasContainer: (canvasContainerElement: HTMLDivElement) => {
      this.canvasContainer = canvasContainerElement;
    },
  };

  public componentDidMount() {
    this.setupCanvas();
    this.handleWindowResize();
    window.addEventListener("resize", this.handleWindowResize);
  }

  public render() {
    return (
      <div ref={this.refHandlers.canvasContainer} className={Styles.container}>
        <canvas className={Styles.canvas} ref={this.refHandlers.canvas} />
        <div className={Styles.trash} onClick={this.clearCanvas}>
          <Iconicon className={Styles.trashIcon} icon="md-trash" color={Colors.grey} />
        </div>
      </div>
    );
  }

  public clearCanvas = () => {
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.onCanvasTouch(true);
  };

  public getURL = (): Promise<string> => {
    return new Promise(resolve => {
      this.canvas.toBlob(async blob => {
        const fileName = await sendToS3(blob);
        resolve(fileName);
      });
    });
  };

  private onCanvasTouch = (isEmpty: boolean) => {
    const { onCanvasChange } = this.props;
    if (onCanvasChange !== undefined) {
      onCanvasChange(isEmpty);
    }
  }
  private setupCanvas = () => {
    this.canvas.addEventListener("mousemove", this.handleDraw, false);
    this.canvas.addEventListener("mousedown", this.handleStartDrawing, false);
    this.canvas.addEventListener("mouseup", this.handleStopDrawing, false);
    this.canvas.addEventListener("mouseout", this.handleStopDrawing, false);

    this.canvas.addEventListener("touchmove", this.handleTouchMove, false);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, false);
    this.canvas.addEventListener("touchend", this.handleTouchEnd, false);

    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }
    ctx.strokeStyle = "#3a3937";
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (e.target === this.canvas) {
      e.preventDefault();
    }

    const { clientX, clientY } = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", { clientX, clientY });
    this.canvas.dispatchEvent(mouseEvent);
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.target === this.canvas) {
      e.preventDefault();
    }

    const { clientX, clientY } = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", { clientX, clientY });
    this.canvas.dispatchEvent(mouseEvent);
  };

  private handleTouchEnd = (e: TouchEvent) => {
    if (e.target === this.canvas) {
      e.preventDefault();
    }

    const mouseEvent = new MouseEvent("mouseup", {});
    this.canvas.dispatchEvent(mouseEvent);
  };

  private handleStartDrawing = (e: MouseEvent) => {
    const canvas = this.canvas;
    const canvasContainer = this.canvasContainer;
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    this.onCanvasTouch(false);

    this.prevMouse = this.currMouse;
    this.currMouse = {
      x: e.clientX - canvasContainer.offsetLeft,
      y: e.clientY - canvasContainer.offsetTop,
    };

    this.isDrawing = true;
    ctx.beginPath();
    ctx.fillRect(this.currMouse.x, this.currMouse.y, 1, 1);
    ctx.closePath();
  };

  private handleStopDrawing = (e: MouseEvent) => {
    this.isDrawing = false;
  };

  private handleDraw = (e: MouseEvent) => {
    const canvas = this.canvas;
    const canvasContainer = this.canvasContainer;
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    if (this.isDrawing) {
      this.prevMouse = this.currMouse;
      this.currMouse = {
        x: e.clientX - canvasContainer.offsetLeft,
        y: e.clientY - canvasContainer.offsetTop,
      };

      ctx.beginPath();
      ctx.moveTo(this.prevMouse.x, this.prevMouse.y);
      ctx.lineTo(this.currMouse.x, this.currMouse.y);

      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.closePath();
    }
  };

  private handleWindowResize = () => {
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    const imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const size = Math.min(window.innerWidth - 20, 500);

    this.canvas.width = size;
    this.canvas.height = size;

    ctx.putImageData(imgData, 0, 0);
  };
}

namespace Styles {
  export const container = style({
    position: "relative",
  },
    csstips.margin(10, 0),
  );

  export const canvas = style(
    {
      backgroundColor: Colors.white,
      boxShadow: Shadows.one,
      verticalAlign: "bottom",
    },
  );

  export const trash = style({
    $nest: {
      "&&:active": {
        background: color(Colors.grey).lighten(.1).toString(),
      },
      "&:hover": {
        background: color(Colors.grey).lighten(.15).toString(),
      },
    },
    borderRadius: "5px",
    bottom: 0,
    height: "40px",
    position: "absolute",
    right: 0,
    width: "40px",
  }, csstips.flexRoot, csstips.center, csstips.centerJustified, csstips.margin(5), csstips.padding(5),)

  export const trashIcon = style({
    color: Colors.grey,
  }, csstips.flex)
}
