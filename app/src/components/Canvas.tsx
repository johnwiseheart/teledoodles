import * as React from "react";
import { Colors, csstips, Shadows, style } from "../styles";
import { sendToS3 } from "../utils";

interface IPoint {
  x: number;
  y: number;
}

export class Canvas extends React.Component {
  private isDrawing = false;
  private prevMouse: IPoint;
  private currMouse: IPoint;

  private canvas: HTMLCanvasElement;
  private refHandlers = {
    canvas: (canvasElement: HTMLCanvasElement) => {
      this.canvas = canvasElement;
    },
  };

  public componentDidMount() {
    this.setupCanvas();
    this.handleWindowResize();
    window.addEventListener("resize", this.handleWindowResize);
  }

  public render() {
    return <canvas className={Styles.canvas} ref={this.refHandlers.canvas} />;
  }

  public clearCanvas = () => {
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  public getURL = (): Promise<string> => {
    return new Promise(resolve => {
      this.canvas.toBlob(async blob => {
        const fileName = await sendToS3(blob);
        resolve(fileName);
      });
    });
  };

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
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    this.prevMouse = this.currMouse;
    this.currMouse = {
      x: e.clientX - canvas.offsetLeft,
      y: e.clientY - canvas.offsetTop,
    };

    this.isDrawing = true;
    ctx.beginPath();
    ctx.fillRect(this.currMouse.x, this.currMouse.y, 2, 2);
    ctx.closePath();
  };

  private handleStopDrawing = (e: MouseEvent) => {
    this.isDrawing = false;
  };

  private handleDraw = (e: MouseEvent) => {
    const canvas = this.canvas;
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    if (this.isDrawing) {
      this.prevMouse = this.currMouse;
      this.currMouse = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
      };

      ctx.beginPath();
      ctx.moveTo(this.prevMouse.x, this.prevMouse.y);
      ctx.lineTo(this.currMouse.x, this.currMouse.y);

      ctx.lineWidth = 2;
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
    const size = Math.min(window.innerWidth - 26, 500 - 6);

    this.canvas.width = size;
    this.canvas.height = size;

    ctx.putImageData(imgData, 0, 0);
  };
}

namespace Styles {
  export const canvas = style(
    {
      backgroundColor: Colors.primary,
      boxShadow: Shadows.one,
      verticalAlign: "bottom",
    },
    csstips.margin(10, 0),
  );
}
