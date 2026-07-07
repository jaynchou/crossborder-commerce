import type {
  Address,
  CartItem,
  Coupon,
  Customer,
  MediaAsset,
  Order,
  PaymentMethod,
  Product,
  ProductAttribute,
  ProductVariant,
  Refund,
  Review,
  ShippingRate,
  StoreSettings
} from "./types";

type StoreState = {
  settings: StoreSettings;
  products: Product[];
  coupons: Coupon[];
  productAttributes: ProductAttribute[];
  productVariants: ProductVariant[];
  mediaAssets: MediaAsset[];
  shippingRates: ShippingRate[];
  customers: Customer[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
  refunds: Refund[];
  reviews: Review[];
};

declare global {
  // Keeps the in-memory repository coherent across Next.js route/page module instances.
  // eslint-disable-next-line no-var
  var __crossborderStore: StoreState | undefined;
}

const store = globalThis.__crossborderStore ??= createInitialStore();
const {
  settings,
  products,
  coupons,
  productAttributes,
  productVariants,
  mediaAssets,
  shippingRates,
  customers,
  paymentMethods,
  orders,
  refunds,
  reviews
} = store;

function createInitialStore(): StoreState {
  return {
    settings: {
      name: "CrossBorder Commerce",
      defaultCurrency: "USD",
      supportedCountries: ["US", "CA", "GB", "AU", "SG", "JP"],
      taxRate: 0.07
    },
    products: [
      {
        id: "album-cloud-001",
        sku: "CB-SCARF-001",
        title: "Merino Travel Scarf",
        subtitle: "Lightweight warmth for global shipping",
        description: "Soft merino blend scarf prepared for cross-border gifting and cold-weather travel.",
        price: 39,
        currency: "USD",
        originalPrice: 59,
        category: "Apparel",
        originCountry: "CN",
        shipFrom: "CN-SZX",
        weightGrams: 320,
        stock: 86,
        reserved: 2,
        images: ["/products/scarf.svg"],
        tags: ["Giftable", "Winter"],
        featured: true,
        status: "active"
      },
      {
        id: "album-tea-002",
        sku: "CB-TEA-002",
        title: "Cold Brew Tea Set",
        subtitle: "Shelf-stable starter product",
        description: "A lightweight tea set with clear customs attributes and strong margin potential.",
        price: 24,
        currency: "USD",
        originalPrice: 32,
        category: "Food & Beverage",
        originCountry: "CN",
        shipFrom: "CN-HGH",
        weightGrams: 540,
        stock: 120,
        reserved: 0,
        images: ["/products/tea.svg"],
        tags: ["New", "Lightweight"],
        featured: true,
        status: "active"
      },
      {
        id: "album-bag-003",
        sku: "CB-BAG-003",
        title: "Packable Daily Tote",
        subtitle: "Low-risk lifestyle SKU",
        description: "Water-resistant tote with simple variants and easy fulfillment.",
        price: 45,
        currency: "USD",
        category: "Bags",
        originCountry: "VN",
        shipFrom: "CN-SZX",
        weightGrams: 780,
        stock: 42,
        reserved: 6,
        images: ["/products/bag.svg"],
        tags: ["Travel", "In stock"],
        featured: true,
        status: "active"
      }
    ],
    coupons: [
      { code: "LAUNCH10", type: "percentage", value: 10, active: true, minSubtotal: 30 },
      { code: "FREESHIP", type: "fixed", value: 8, active: true, minSubtotal: 60 }
    ],
    productAttributes: [
      { id: "attr-color", name: "Color", values: ["Stone", "Sage", "Black"], visible: true, variation: true },
      { id: "attr-size", name: "Size", values: ["S", "M", "L"], visible: true, variation: true },
      { id: "attr-material", name: "Material", values: ["Merino blend", "Canvas", "Tea leaves"], visible: true, variation: false }
    ],
    productVariants: [
      {
        id: "var-scarf-stone",
        productId: "album-cloud-001",
        sku: "CB-SCARF-001-STONE",
        attributes: { Color: "Stone", Size: "M" },
        price: 39,
        stock: 32,
        weightGrams: 320,
        image: "/products/scarf.svg"
      },
      {
        id: "var-bag-black",
        productId: "album-bag-003",
        sku: "CB-BAG-003-BLK",
        attributes: { Color: "Black" },
        price: 45,
        stock: 18,
        weightGrams: 780,
        image: "/products/bag.svg"
      }
    ],
    mediaAssets: [
      { id: "media-scarf", fileName: "scarf.svg", url: "/products/scarf.svg", type: "image", alt: "Merino Travel Scarf", sizeKb: 2, usedBy: ["CB-SCARF-001"] },
      { id: "media-tea", fileName: "tea.svg", url: "/products/tea.svg", type: "image", alt: "Cold Brew Tea Set", sizeKb: 2, usedBy: ["CB-TEA-002"] },
      { id: "media-bag", fileName: "bag.svg", url: "/products/bag.svg", type: "image", alt: "Packable Daily Tote", sizeKb: 2, usedBy: ["CB-BAG-003"] }
    ],
    shippingRates: [
      {
        id: "standard-global",
        name: "Standard Global",
        countries: ["US", "CA", "GB", "AU", "SG", "JP"],
        basePrice: 8,
        perKgPrice: 4,
        etaDays: "7-14"
      },
      {
        id: "priority-global",
        name: "Priority Global",
        countries: ["US", "CA", "GB", "AU", "SG", "JP"],
        basePrice: 18,
        perKgPrice: 7,
        etaDays: "4-8"
      }
    ],
    customers: [
      {
        id: "cus_demo_001",
        name: "Demo Buyer",
        email: "buyer@example.com",
        phone: "+1 555 0100",
        country: "US",
        createdAt: new Date().toISOString()
      }
    ],
    paymentMethods: [
      { id: "pay-stripe", name: "Credit card", provider: "stripe", enabled: false, currencies: ["USD", "EUR", "GBP"] },
      { id: "pay-paypal", name: "PayPal", provider: "paypal", enabled: false, currencies: ["USD", "EUR", "GBP"] },
      { id: "pay-manual", name: "Manual test payment", provider: "manual", enabled: true, currencies: ["USD"] }
    ],
    orders: [
      {
        id: "CB20260706001",
        customerId: "cus_demo_001",
        customer: {
          name: "Demo Buyer",
          phone: "+1 555 0100",
          email: "buyer@example.com",
          country: "US",
          province: "CA",
          city: "Los Angeles",
          line1: "88 Demo Street",
          postalCode: "90001"
        },
        items: [{ productId: "album-cloud-001", quantity: 1 }],
        subtotal: 39,
        discount: 0,
        shipping: 10,
        tax: 2.73,
        total: 51.73,
        currency: "USD",
        status: "paid",
        paymentStatus: "paid",
        fulfillmentStatus: "unfulfilled",
        createdAt: new Date().toISOString()
      }
    ],
    refunds: [
      { id: "ref_demo_001", orderId: "CB20260706001", amount: 12, currency: "USD", reason: "Partial shipping adjustment", status: "requested" }
    ],
    reviews: [
      { id: "rev_demo_001", productId: "album-cloud-001", customerName: "Demo Buyer", rating: 5, status: "approved", body: "Soft and easy to gift." },
      { id: "rev_demo_002", productId: "album-tea-002", customerName: "Wholesale Tester", rating: 4, status: "pending", body: "Good starter SKU, needs stronger packaging." }
    ]
  };
}

export function listProducts() {
  return products.filter((product) => product.status === "active");
}

export function listAllProducts() {
  return products;
}

export function listCategories() {
  return Array.from(new Set(products.map((product) => product.category))).sort();
}

export function listCategoryStats() {
  return listCategories().map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    return {
      name: category,
      products: categoryProducts.length,
      active: categoryProducts.filter((product) => product.status === "active").length,
      stock: categoryProducts.reduce((sum, product) => sum + product.stock, 0)
    };
  });
}

export function listTags() {
  return Array.from(new Set(products.flatMap((product) => product.tags))).sort();
}

export function listProductAttributes() {
  return productAttributes;
}

export function listProductVariants(productId?: string) {
  if (!productId) return productVariants;
  return productVariants.filter((variant) => variant.productId === productId);
}

export function listMediaAssets() {
  return mediaAssets;
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function createProduct(input: Omit<Product, "id"> & { id?: string }) {
  const product: Product = {
    ...input,
    id: input.id ?? `product-${Date.now()}`
  };
  products.unshift(product);
  return product;
}

export function listCoupons() {
  return coupons;
}

export function listPaymentMethods() {
  return paymentMethods;
}

export function listRefunds() {
  return refunds;
}

export function listReviews() {
  return reviews;
}

export function validateCoupon(code: string, subtotal: number) {
  const coupon = coupons.find((item) => item.code.toUpperCase() === code.toUpperCase() && item.active);
  if (!coupon) return null;
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return null;
  return coupon;
}

export function listShippingRates(country?: string) {
  if (!country) return shippingRates;
  return shippingRates.filter((rate) => rate.countries.includes(country));
}

export function calculateCart(items: CartItem[], options?: { country?: string; couponCode?: string; shippingRateId?: string }) {
  const enrichedItems = items.map((item) => {
    const product = getProduct(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} does not exist`);
    }
    if (item.quantity > product.stock - product.reserved) {
      throw new Error(`Not enough stock for ${product.title}`);
    }
    return {
      ...item,
      product,
      subtotal: product.price * item.quantity
    };
  });

  const subtotal = roundMoney(enrichedItems.reduce((sum, item) => sum + item.subtotal, 0));
  const totalWeightGrams = enrichedItems.reduce((sum, item) => sum + item.product.weightGrams * item.quantity, 0);
  const coupon = options?.couponCode ? validateCoupon(options.couponCode, subtotal) : null;
  const discount = roundMoney(coupon ? (coupon.type === "percentage" ? subtotal * (coupon.value / 100) : coupon.value) : 0);
  const country = options?.country ?? settings.supportedCountries[0];
  const rates = listShippingRates(country);
  const selectedRate = rates.find((rate) => rate.id === options?.shippingRateId) ?? rates[0];
  const shipping = selectedRate ? roundMoney(selectedRate.basePrice + (totalWeightGrams / 1000) * selectedRate.perKgPrice) : 0;
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = roundMoney(taxableAmount * settings.taxRate);
  const total = roundMoney(taxableAmount + shipping + tax);

  return {
    items: enrichedItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    currency: settings.defaultCurrency,
    shippingRate: selectedRate ?? null,
    coupon: coupon ?? null
  };
}

export function createOrder(input: { customer: Address; items: CartItem[]; couponCode?: string; shippingRateId?: string }) {
  const cart = calculateCart(input.items, {
    country: input.customer.country,
    couponCode: input.couponCode,
    shippingRateId: input.shippingRateId
  });
  const order: Order = {
    customer: input.customer,
    items: input.items,
    id: `CB${Date.now()}`,
    subtotal: cart.subtotal,
    discount: cart.discount,
    shipping: cart.shipping,
    tax: cart.tax,
    total: cart.total,
    currency: cart.currency,
    status: "pending_payment",
    paymentStatus: "unpaid",
    fulfillmentStatus: "unfulfilled",
    createdAt: new Date().toISOString()
  };
  reserveInventory(input.items);
  orders.unshift(order);
  return order;
}

export function listOrders() {
  return orders;
}

export function listCustomers() {
  return customers;
}

export function listInventory() {
  return products.map((product) => ({
    productId: product.id,
    sku: product.sku,
    title: product.title,
    stock: product.stock,
    reserved: product.reserved,
    available: product.stock - product.reserved,
    shipFrom: product.shipFrom
  }));
}

export function fulfillOrder(orderId: string, trackingNumber: string) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  order.status = "fulfilled";
  order.fulfillmentStatus = "fulfilled";
  order.trackingNumber = trackingNumber;
  return order;
}

export function getSettings() {
  return settings;
}

export function getMetrics() {
  const paidOrders = orders.filter((order) => order.status !== "cancelled");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  return {
    revenue: roundMoney(revenue),
    orders: orders.length,
    products: products.length,
    customers: customers.length,
    lowStock: products.filter((product) => product.stock - product.reserved < 50).length,
    currency: settings.defaultCurrency
  };
}

export function getReports() {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const units = orders.reduce((sum, order) => order.items.reduce((itemSum, item) => itemSum + item.quantity, sum), 0);
  const averageOrderValue = orders.length ? roundMoney(revenue / orders.length) : 0;

  return {
    revenue: roundMoney(revenue),
    units,
    averageOrderValue,
    refundRequests: refunds.length,
    pendingReviews: reviews.filter((review) => review.status === "pending").length,
    topCountries: settings.supportedCountries.slice(0, 4)
  };
}

function reserveInventory(items: CartItem[]) {
  for (const item of items) {
    const product = getProduct(item.productId);
    if (product) {
      product.reserved += item.quantity;
    }
  }
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
