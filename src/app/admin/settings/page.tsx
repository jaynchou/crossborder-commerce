import { AdminLayout } from "@/components/AdminLayout";
import { getSettings } from "@/lib/store";

export default function SettingsPage() {
  const settings = getSettings();

  return (
    <AdminLayout eyebrow="Configuration" title="Store settings">
      <section className="panel">
        <h2>General settings</h2>
        <div className="adminCards">
          <div>
            <h3>Store name</h3>
            <strong>{settings.name}</strong>
          </div>
          <div>
            <h3>Default currency</h3>
            <strong>{settings.defaultCurrency}</strong>
          </div>
          <div>
            <h3>Supported countries</h3>
            <p>{settings.supportedCountries.join(", ")}</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
