"use client";

import { useState } from "react";
import type { MediaAsset } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type MediaManagerProps = {
  assets: MediaAsset[];
};

export function MediaManager({ assets: initialAssets }: MediaManagerProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [fileName, setFileName] = useState("campaign-banner.svg");
  const [url, setUrl] = useState("/products/scarf.svg");
  const [alt, setAlt] = useState("Campaign product image");
  const [usedBy, setUsedBy] = useState("CB-SCARF-001");
  const [message, setMessage] = useState("Register image or video URLs already hosted in public assets or object storage.");

  async function registerAsset() {
    setMessage("Registering media asset...");
    const response = await fetch("/api/admin/media", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        fileName,
        url,
        type: "image",
        alt,
        sizeKb: 0,
        usedBy: usedBy.split(",").map((item) => item.trim()).filter(Boolean)
      })
    });
    const result = (await response.json()) as ApiResult<MediaAsset>;

    if (result.ok && result.data) {
      setAssets((current) => [result.data as MediaAsset, ...current]);
      setMessage(`Registered ${result.data.fileName}.`);
    } else {
      setMessage(result.error ?? "Unable to register media.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Media library</h2>
          <p className="statusText">{message}</p>
        </div>
        <button type="button" onClick={registerAsset}>Register media</button>
      </div>
      <div className="professionalForm twoColumns compactAdminForm">
        <label>File name
          <input value={fileName} onChange={(event) => setFileName(event.target.value)} />
        </label>
        <label>URL
          <input value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
        <label>Alt text
          <input value={alt} onChange={(event) => setAlt(event.target.value)} />
        </label>
        <label>Used by SKUs
          <input value={usedBy} onChange={(event) => setUsedBy(event.target.value)} />
        </label>
      </div>
      <div className="mediaGrid">
        {assets.map((asset) => (
          <article className="mediaCard" key={asset.id}>
            <img alt={asset.alt} src={asset.url} />
            <strong>{asset.fileName}</strong>
            <span>{asset.type} | {asset.sizeKb} KB</span>
            <span>Used by {asset.usedBy.join(", ") || "No products yet"}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
