import { Experience } from "@/components/Experience";
import { getAvailableLayerIds } from "@/lib/layerAssets.server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const availableLayerIds = await getAvailableLayerIds();
  return <Experience availableLayerIds={availableLayerIds} />;
}
