"use client";

import type { CartItem } from "@/lib/types";

const CART_STORAGE_KEY = "crossborder-cart-v1";

export function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => typeof item.productId === "string" && Number.isInteger(item.quantity))
      .map((item) => ({
        productId: item.productId,
        quantity: Math.min(Math.max(item.quantity, 1), 99)
      }));
  } catch {
    return [];
  }
}

export function writeStoredCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("crossborder-cart-updated"));
}

export function addStoredCartItem(productId: string, quantity = 1) {
  const items = readStoredCart();
  const existing = items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 99);
  } else {
    items.push({ productId, quantity });
  }

  writeStoredCart(items);
  return items;
}

export function clearStoredCart() {
  writeStoredCart([]);
}
