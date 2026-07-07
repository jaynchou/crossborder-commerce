"use client";

import { useState } from "react";
import { money } from "@/components/Money";
import type { ShippingRate } from "@/lib/types";

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type ShippingRateManagerProps = {
  rates: ShippingRate[];
};

export function ShippingRateManager({ rates: initialRates }: ShippingRateManagerProps) {
  const [rates, setRates] = useState(initialRates);
  const [id, setId] = useState("economy-global");
  const [name, setName] = useState("Economy Global");
  const [countries, setCountries] = useState("US, CA, GB");
  const [basePrice, setBasePrice] = useState("5");
  const [perKgPrice, setPerKgPrice] = useState("3");
  const [etaDays, setEtaDays] = useState("10-18");
  const [message, setMessage] = useState("Shipping rates feed cart, checkout, and product delivery promises.");

  async function createRate() {
    setMessage("Creating shipping rate...");
    const response = await fetch("/api/admin/shipping", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id,
        name,
        countries: countries.split(",").map((country) => country.trim().toUpperCase()).filter(Boolean),
        basePrice: Number(basePrice),
        perKgPrice: Number(perKgPrice),
        etaDays
      })
    });
    const result = (await response.json()) as ApiResult<ShippingRate>;

    if (result.ok && result.data) {
      setRates((current) => [result.data as ShippingRate, ...current]);
      setMessage(`Created shipping rate ${result.data.name}.`);
    } else {
      setMessage(result.error ?? "Unable to create shipping rate.");
    }
  }

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Shipping zones and rates</h2>
          <p className="statusText">{message}</p>
        </div>
        <button type="button" onClick={createRate}>Add rate</button>
      </div>
      <div className="professionalForm twoColumns compactAdminForm">
        <label>Rate ID
          <input value={id} onChange={(event) => setId(event.target.value)} />
        </label>
        <label>Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>Countries
          <input value={countries} onChange={(event) => setCountries(event.target.value)} />
        </label>
        <label>ETA days
          <input value={etaDays} onChange={(event) => setEtaDays(event.target.value)} />
        </label>
        <label>Base price
          <input inputMode="decimal" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} />
        </label>
        <label>Per kg price
          <input inputMode="decimal" value={perKgPrice} onChange={(event) => setPerKgPrice(event.target.value)} />
        </label>
      </div>
      <div className="table">
        {rates.map((rate) => (
          <div className="tableRow shippingRow" key={rate.id}>
            <span>{rate.name}</span>
            <span>{rate.countries.join(", ")}</span>
            <span>{money(rate.basePrice)}</span>
            <span>{money(rate.perKgPrice)} / kg</span>
            <span>{rate.etaDays} days</span>
          </div>
        ))}
      </div>
    </section>
  );
}
