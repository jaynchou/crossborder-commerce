"use client";

import { useState } from "react";
import type { StoreSettings } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type SettingsFormProps = {
  settings: StoreSettings;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [name, setName] = useState(settings.name);
  const [defaultCurrency, setDefaultCurrency] = useState(settings.defaultCurrency);
  const [supportedCountries, setSupportedCountries] = useState(settings.supportedCountries.join(", "));
  const [taxRatePercent, setTaxRatePercent] = useState(String(Math.round(settings.taxRate * 100)));
  const [adminToken, setAdminToken] = useState("");
  const [message, setMessage] = useState("Settings are loaded from the in-memory repository.");

  async function saveSettings() {
    setMessage("Saving settings...");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-admin-token": adminToken
      },
      body: JSON.stringify({
        name,
        defaultCurrency: defaultCurrency.toUpperCase(),
        supportedCountries: supportedCountries
          .split(",")
          .map((country) => country.trim().toUpperCase())
          .filter(Boolean),
        taxRate: Number(taxRatePercent) / 100
      })
    });
    const result = (await response.json()) as ApiResult<StoreSettings>;
    setMessage(result.ok && result.data ? "Settings saved for this running app instance." : result.error ?? "Unable to save settings.");
  }

  return (
    <section className="panel settingsEditor">
      <div className="panelHeader">
        <div>
          <h2>Editable settings</h2>
          <p className="statusText">Changes apply immediately while the local or deployed server process is running.</p>
        </div>
        <button data-testid="save-settings" type="button" onClick={saveSettings}>Save settings</button>
      </div>
      <div className="professionalForm twoColumns">
        <label>Store name
          <input data-testid="settings-name" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>Default currency
          <input data-testid="settings-currency" maxLength={3} value={defaultCurrency} onChange={(event) => setDefaultCurrency(event.target.value.toUpperCase())} />
        </label>
        <label className="fullField">Supported countries
          <input data-testid="settings-countries" value={supportedCountries} onChange={(event) => setSupportedCountries(event.target.value)} />
        </label>
        <label>Tax rate percent
          <input data-testid="settings-tax" inputMode="decimal" value={taxRatePercent} onChange={(event) => setTaxRatePercent(event.target.value)} />
        </label>
        <label>Admin token
          <input data-testid="settings-admin-token" type="password" value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder="ADMIN_TOKEN" />
        </label>
      </div>
      <p className="statusText">{message}</p>
    </section>
  );
}
