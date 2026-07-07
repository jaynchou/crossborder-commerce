export type Product = {
  id: string;
  sku: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  currency: string;
  originalPrice?: number;
  category: string;
  originCountry: string;
  shipFrom: string;
  weightGrams: number;
  stock: number;
  reserved: number;
  images: string[];
  tags: string[];
  featured: boolean;
  status: "active" | "draft";
};

export type CategoryPage = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type ProductAttribute = {
  id: string;
  name: string;
  values: string[];
  visible: boolean;
  variation: boolean;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  weightGrams: number;
  image?: string;
};

export type MediaAsset = {
  id: string;
  fileName: string;
  url: string;
  type: "image" | "video";
  alt: string;
  sizeKb: number;
  usedBy: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Address = {
  name: string;
  phone: string;
  email?: string;
  country: string;
  province: string;
  city: string;
  line1: string;
  postalCode: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  createdAt: string;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "unpaid" | "authorized" | "paid" | "failed" | "refunded";
export type FulfillmentStatus = "unfulfilled" | "partial" | "fulfilled";

export type Order = {
  id: string;
  customerId?: string;
  customer: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  createdAt: string;
};

export type Coupon = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  minSubtotal?: number;
};

export type ShippingRate = {
  id: string;
  name: string;
  countries: string[];
  basePrice: number;
  perKgPrice: number;
  etaDays: string;
};

export type StoreSettings = {
  name: string;
  defaultCurrency: string;
  supportedCountries: string[];
  taxRate: number;
};

export type PageContent = {
  promoBar: string[];
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    featuredProductId: string;
  };
  template: "editorial-grid" | "product-focus";
};

export type PaymentMethod = {
  id: string;
  name: string;
  provider: "stripe" | "paypal" | "manual";
  enabled: boolean;
  currencies: string[];
};

export type Refund = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
  status: "requested" | "approved" | "rejected" | "paid";
};

export type Review = {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  status: "pending" | "approved" | "spam";
  body: string;
  createdAt?: string;
};
