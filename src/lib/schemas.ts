import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(99)
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  country: z.string().length(2).optional(),
  couponCode: z.string().optional(),
  shippingRateId: z.string().optional()
});

export const addressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  country: z.string().length(2),
  province: z.string().min(1),
  city: z.string().min(1),
  line1: z.string().min(5),
  postalCode: z.string().min(3)
});

export const orderSchema = z.object({
  customer: addressSchema,
  items: z.array(cartItemSchema).min(1),
  couponCode: z.string().optional(),
  shippingRateId: z.string().optional()
});

export const productSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  description: z.string().min(5),
  price: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  originalPrice: z.number().positive().optional(),
  category: z.string().min(1),
  originCountry: z.string().length(2),
  shipFrom: z.string().min(2),
  weightGrams: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  reserved: z.number().int().nonnegative().default(0),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["active", "draft"]).default("active")
});

export const couponValidationSchema = z.object({
  code: z.string().min(2),
  subtotal: z.number().nonnegative()
});

export const shippingRateSchema = z.object({
  country: z.string().length(2).optional()
});

export const fulfillmentSchema = z.object({
  orderId: z.string().min(1),
  trackingNumber: z.string().min(4)
});
