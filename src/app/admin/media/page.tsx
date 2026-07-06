import { AdminLayout } from "@/components/AdminLayout";
import { listMediaAssets } from "@/lib/store";

export default function MediaPage() {
  const assets = listMediaAssets();

  return (
    <AdminLayout eyebrow="Catalog" title="Media library">
      <section className="panel">
        <div className="panelHeader">
          <h2>Product uploads</h2>
          <button>Upload media</button>
        </div>
        <div className="mediaGrid">
          {assets.map((asset) => (
            <article className="mediaCard" key={asset.id}>
              <img alt={asset.alt} src={asset.url} />
              <strong>{asset.fileName}</strong>
              <span>{asset.type} · {asset.sizeKb} KB</span>
              <span>Used by {asset.usedBy.join(", ")}</span>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
