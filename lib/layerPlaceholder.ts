import type { LayerId } from "@/lib/layers.config";

const palette: Record<LayerId, { sky: string; base: string }> = {
  mountains_far: { sky: "#b9c6c5", base: "#778e91" },
  hills_mid: { sky: "#a4b1a0", base: "#566f64" },
  hills_near: { sky: "#83917d", base: "#344c42" },
  street_lamp: { sky: "#d5a55f", base: "#493b34" },
  grass_front: { sky: "#718763", base: "#304b3d" },
  frame_leaves: { sky: "#73866c", base: "#354c40" },
};

function drawSilhouette(
  context: CanvasRenderingContext2D,
  id: LayerId,
  width: number,
  height: number,
) {
  const colors = palette[id];
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colors.sky);
  gradient.addColorStop(1, colors.base);

  const edgeNoise = (x: number, seed: number) =>
    Math.sin(x * 0.013 + seed) * 15 +
    Math.sin(x * 0.037 + seed * 1.7) * 7 +
    Math.sin(x * 0.091 + seed * 2.3) * 3;

  if (id === "mountains_far" || id === "hills_mid" || id === "hills_near") {
    const ridge = (x: number) => {
      if (id === "mountains_far") {
        return height * 0.6 +
          Math.sin(x * 0.004 + 0.3) * height * 0.075 +
          Math.sin(x * 0.009 + 1.8) * height * 0.025 +
          edgeNoise(x, 4) * 0.35;
      }
      const rolling = Math.sin(x * (id === "hills_mid" ? 0.005 : 0.003) + 2.1);
      return height * (id === "hills_mid" ? 0.69 : 0.79) -
        (rolling * 0.055 + 0.065) * height +
        edgeNoise(x, id === "hills_mid" ? 7 : 11) * 0.45;
    };

    context.beginPath();
    context.moveTo(0, height);
    context.lineTo(0, ridge(0));
    for (let x = 0; x <= width; x += 4) {
      context.lineTo(x, ridge(x));
    }
    context.lineTo(width, height);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();

    return;
  }

  if (id === "frame_leaves") {
    for (let side = 0; side < 2; side += 1) {
      const direction = side === 0 ? 1 : -1;
      context.fillStyle = colors.base;
      context.beginPath();
      context.moveTo(side === 0 ? 0 : width, 0);
      for (let y = 0; y <= height * 0.76; y += 26) {
        const x =
          (side === 0 ? 0 : width) +
          direction * (26 + Math.sin(y * 0.038 + side) * 21);
        context.quadraticCurveTo(
          x - direction * 18,
          y - 14,
          x,
          y + 10,
        );
      }
      context.lineTo(side === 0 ? 0 : width, height * 0.76);
      context.closePath();
      context.fill();
    }
    return;
  }

  if (id === "street_lamp") {
    const x = width * 0.5;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.fillStyle = "#493e35";
    context.beginPath();
    context.ellipse(x, height * 0.96, width * 0.055, height * 0.022, 0, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#493e35";
    context.lineWidth = 13;
    context.beginPath();
    context.moveTo(x, height * 0.91);
    context.lineTo(x, height * 0.35);
    context.stroke();

    context.strokeStyle = "#59483a";
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(x, height * 0.37);
    context.quadraticCurveTo(x, height * 0.25, x - width * 0.09, height * 0.25);
    context.stroke();

    context.fillStyle = "#514237";
    context.fillRect(x - width * 0.15, height * 0.26, width * 0.12, height * 0.16);
    context.fillStyle = "#836747";
    context.fillRect(x - width * 0.16, height * 0.25, width * 0.14, height * 0.028);
    context.fillRect(x - width * 0.15, height * 0.41, width * 0.12, height * 0.025);
    context.fillStyle = "rgba(255, 207, 124, 0.92)";
    context.fillRect(x - width * 0.133, height * 0.285, width * 0.086, height * 0.108);
    context.fillStyle = "#514237";
    context.fillRect(x - width * 0.155, height * 0.225, width * 0.13, height * 0.025);
    context.fillRect(x - width * 0.115, height * 0.205, width * 0.05, height * 0.02);

    context.strokeStyle = "#776047";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(x - width * 0.017, height * 0.42);
    context.lineTo(x - width * 0.017, height * 0.9);
    context.stroke();
  }
}

export function createLayerPlaceholder(id: LayerId) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(`Tidak dapat membuat placeholder layer ${id}.`);
  }

  drawSilhouette(context, id, canvas.width, canvas.height);
  return canvas;
}
