import { AdminLayout } from "@/components/AdminLayout";
import { MediaManager } from "@/components/MediaManager";
import { listMediaAssets } from "@/lib/store";

export default function MediaPage() {
  const assets = listMediaAssets();

  return (
    <AdminLayout eyebrow="Catalog" title="Media library">
      <MediaManager assets={assets} />
    </AdminLayout>
  );
}
