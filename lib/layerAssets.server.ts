import { open } from "node:fs/promises";
import path from "node:path";
import { allSceneLayers } from "@/lib/layers.config";

async function isWebpAsset(assetPath: string) {
  const absolutePath = path.join(
    process.cwd(),
    "public",
    ...assetPath.split("/").filter(Boolean),
  );

  let file;
  try {
    file = await open(absolutePath, "r");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }
    throw error;
  }

  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await file.read(header, 0, header.length, 0);
    return (
      bytesRead === header.length &&
      header.toString("ascii", 0, 4) === "RIFF" &&
      header.toString("ascii", 8, 12) === "WEBP"
    );
  } finally {
    await file.close();
  }
}

export async function getAvailableLayerIds() {
  const results = await Promise.all(
    allSceneLayers.map(async (layer) => ({
      id: layer.id,
      available: await isWebpAsset(layer.path),
    })),
  );

  return results.filter((result) => result.available).map((result) => result.id);
}
