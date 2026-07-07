import type {
  Address,
  CategoryPage,
  CartItem,
  Coupon,
  Customer,
  MediaAsset,
  Order,
  PageContent,
  PaymentMethod,
  Product,
  ProductAttribute,
  ProductVariant,
  Refund,
  Review,
  ShippingRate,
  StoreSettings
} from "./types";
import { categoryToSlug } from "./slugs";

type StoreState = {
  settings: StoreSettings;
  pageContent: PageContent;
  categories: string[];
  categoryPages: CategoryPage[];
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
  var __crossborderStore: StoreState | undefined;
}

const store = globalThis.__crossborderStore ??= createInitialStore();
store.pageContent ??= createDefaultPageContent();
store.categoryPages ??= createDefaultCategoryPages(store.categories);
const {
  settings,
  pageContent,
  categories,
  categoryPages,
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
    pageContent: createDefaultPageContent(),
    categories: ["Apparel", "Food & Beverage", "Bags"],
    categoryPages: createDefaultCategoryPages(["Apparel", "Food & Beverage", "Bags"]),
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
      {
        id: "rev_demo_001",
        productId: "album-cloud-001",
        customerName: "Demo Buyer",
        rating: 5,
        status: "approved",
        body: "Soft and easy to gift.",
        createdAt: new Date().toISOString()
      },
      {
        id: "rev_demo_002",
        productId: "album-tea-002",
        customerName: "Wholesale Tester",
        rating: 4,
        status: "pending",
        body: "Good starter SKU, needs stronger packaging.",
        createdAt: new Date().toISOString()
      }
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
  return Array.from(new Set([...categories, ...products.map((product) => product.category)])).sort();
}

export function listCategoryPages() {
  return listCategories().map((category) => getCategoryPage(category));
}

export function findCategoryPageBySlug(slug: string) {
  return listCategoryPages().find((category) => category.slug === decodeURIComponent(slug));
}

export function listCategoryStats() {
  return listCategories().map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    const categoryPage = getCategoryPage(category);
    return {
      name: category,
      slug: categoryPage.slug,
      description: categoryPage.description,
      image: categoryPage.image,
      products: categoryProducts.length,
      active: categoryProducts.filter((product) => product.status === "active").length,
      stock: categoryProducts.reduce((sum, product) => sum + product.stock, 0)
    };
  });
}

export function createCategory(input: string | { name: string; description?: string; image?: string }) {
  const normalizedName = (typeof input === "string" ? input : input.name).trim();
  if (!normalizedName) {
    throw new Error("Category name is required");
  }
  if (listCategories().some((category) => category.toLowerCase() === normalizedName.toLowerCase())) {
    throw new Error("Category already exists");
  }

  categories.push(normalizedName);
  const categoryPage = upsertCategoryPage({
    name: normalizedName,
    description: typeof input === "string" ? undefined : input.description,
    image: typeof input === "string" ? undefined : input.image
  });
  return {
    name: normalizedName,
    slug: categoryPage.slug,
    description: categoryPage.description,
    image: categoryPage.image,
    products: 0,
    active: 0,
    stock: 0
  };
}

function createDefaultCategoryPages(categoryNames: string[]): CategoryPage[] {
  return categoryNames.map((category) => ({
    name: category,
    slug: categoryToSlug(category),
    description: defaultCategoryDescription(category),
    image: seededCategoryImage(category)
  }));
}

function getCategoryPage(category: string) {
  const existing = categoryPages.find((page) => page.name.toLowerCase() === category.toLowerCase());
  if (existing) return existing;

  return upsertCategoryPage({ name: category });
}

function upsertCategoryPage(input: { name: string; description?: string; image?: string }) {
  const existing = categoryPages.find((page) => page.name.toLowerCase() === input.name.toLowerCase());
  const page: CategoryPage = {
    name: input.name,
    slug: categoryToSlug(input.name),
    description: input.description?.trim() || existing?.description || defaultCategoryDescription(input.name),
    image: input.image?.trim() || existing?.image || defaultCategoryImage(input.name)
  };

  if (existing) {
    existing.slug = page.slug;
    existing.description = page.description;
    existing.image = page.image;
    return existing;
  }

  categoryPages.push(page);
  return page;
}

function defaultCategoryDescription(category: string) {
  return `Shop curated ${category.toLowerCase()} products with transparent cross-border shipping, promotions, and delivery estimates.`;
}

function defaultCategoryImage(category: string) {
  const product = products.find((item) => item.category.toLowerCase() === category.toLowerCase());
  return product?.images[0] ?? seededCategoryImage(category);
}

function seededCategoryImage(category: string) {
  if (category.toLowerCase().includes("bag")) return "/products/bag.svg";
  if (category.toLowerCase().includes("food") || category.toLowerCase().includes("tea")) return "/products/tea.svg";
  return "/products/scarf.svg";
}

function createDefaultPageContent(): PageContent {
  return {
    promoBar: [
      "Free international shipping on orders $79+",
      "10% off with code LAUNCH10",
      "30-day returns on test orders"
    ],
    hero: {
      eyebrow: "New collection",
      title: "Effortless products for global shoppers.",
      body: "Launch a polished storefront with fashion-inspired merchandising, cross-border shipping logic, coupons, inventory reservations, and an admin workflow ready for product testing.",
      primaryLabel: "Shop best sellers",
      primaryHref: "#products",
      secondaryLabel: "Review cart",
      secondaryHref: "/cart",
      featuredProductId: "album-bag-003"
    },
    template: "editorial-grid"
  };
}

export function getDefaultPageContent() {
  return createDefaultPageContent();
}

export function listTags() {
  return Array.from(new Set(products.flatMap((product) => product.tags))).sort();
}

export function listProductAttributes() {
  return productAttributes;
}

export function createProductAttribute(input: Omit<ProductAttribute, "id"> & { id?: string }) {
  if (productAttributes.some((attribute) => attribute.name.toLowerCase() === input.name.toLowerCase())) {
    throw new Error("Attribute already exists");
  }

  const attribute: ProductAttribute = {
    ...input,
    id: input.id ?? `attr-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
  };
  productAttributes.unshift(attribute);
  return attribute;
}

export function listProductVariants(productId?: string) {
  if (!productId) return productVariants;
  return productVariants.filter((variant) => variant.productId === productId);
}

export function listMediaAssets() {
  return mediaAssets;
}

export function createMediaAsset(input: Omit<MediaAsset, "id"> & { id?: string }) {
  const asset: MediaAsset = {
    ...input,
    id: input.id ?? `media-${Date.now()}`
  };
  mediaAssets.unshift(asset);
  return asset;
}

export function createProductVariant(input: Omit<ProductVariant, "id"> & { id?: string }) {
  if (!getProduct(input.productId)) {
    throw new Error("Product not found");
  }
  if (productVariants.some((variant) => variant.sku.toLowerCase() === input.sku.toLowerCase())) {
    throw new Error("Variant SKU already exists");
  }

  const variant: ProductVariant = {
    ...input,
    id: input.id ?? `variant-${input.productId}-${input.sku}`.replace(/\s+/g, "-")
  };
  productVariants.unshift(variant);
  return variant;
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function createProduct(input: Omit<Product, "id"> & {
  id?: string;
  variants?: Array<Omit<ProductVariant, "id" | "productId"> & { id?: string }>;
}) {
  const { variants = [], ...productInput } = input;
  const product: Product = {
    ...productInput,
    id: productInput.id ?? `product-${Date.now()}`
  };
  products.unshift(product);
  if (!categories.some((category) => category.toLowerCase() === product.category.toLowerCase())) {
    categories.push(product.category);
  }

  for (const variant of variants) {
    productVariants.unshift({
      ...variant,
      id: variant.id ?? `variant-${product.id}-${variant.sku}`.replace(/\s+/g, "-"),
      productId: product.id
    });
  }

  return product;
}

export function updateProduct(id: string, input: Omit<Product, "id">) {
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }

  const product: Product = {
    ...input,
    id
  };
  products[index] = product;

  if (!categories.some((category) => category.toLowerCase() === product.category.toLowerCase())) {
    categories.push(product.category);
  }

  return product;
}

export function listCoupons() {
  return coupons;
}

export function createCoupon(input: Coupon) {
  if (coupons.some((coupon) => coupon.code.toUpperCase() === input.code.toUpperCase())) {
    throw new Error("Coupon code already exists");
  }

  const coupon: Coupon = {
    ...input,
    code: input.code.toUpperCase()
  };
  coupons.unshift(coupon);
  return coupon;
}

export function updateCouponStatus(code: string, active: boolean) {
  const coupon = coupons.find((item) => item.code.toUpperCase() === code.toUpperCase());
  if (!coupon) {
    throw new Error("Coupon not found");
  }

  coupon.active = active;
  return coupon;
}

export function listPaymentMethods() {
  return paymentMethods;
}

export function updatePaymentMethodStatus(id: string, enabled: boolean) {
  const method = paymentMethods.find((item) => item.id === id);
  if (!method) {
    throw new Error("Payment method not found");
  }

  method.enabled = enabled;
  return method;
}

export function listRefunds() {
  return refunds;
}

export function updateRefundStatus(id: string, status: Refund["status"]) {
  const refund = refunds.find((item) => item.id === id);
  if (!refund) {
    throw new Error("Refund not found");
  }

  refund.status = status;
  return refund;
}

export function listReviews() {
  return reviews;
}

export function listProductReviews(productId: string, options?: { includePending?: boolean }) {
  return reviews.filter((review) => {
    if (review.productId !== productId) return false;
    return options?.includePending ? review.status !== "spam" : review.status === "approved";
  });
}

export function createReview(input: Pick<Review, "productId" | "customerName" | "rating" | "body">) {
  if (!getProduct(input.productId)) {
    throw new Error("Product not found");
  }

  const review: Review = {
    ...input,
    id: `rev_${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  reviews.unshift(review);
  return review;
}

export function updateReviewStatus(id: string, status: Review["status"]) {
  const review = reviews.find((item) => item.id === id);
  if (!review) {
    throw new Error("Review not found");
  }

  review.status = status;
  return review;
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

export function createShippingRate(input: ShippingRate) {
  if (shippingRates.some((rate) => rate.id === input.id)) {
    throw new Error("Shipping rate already exists");
  }

  shippingRates.unshift(input);
  return input;
}

export function listRelatedProducts(productId: string, limit = 4) {
  const product = getProduct(productId);
  if (!product) return [];

  const scored = listProducts()
    .filter((candidate) => candidate.id !== productId)
    .map((candidate) => ({
      product: candidate,
      score:
        (candidate.category === product.category ? 3 : 0) +
        candidate.tags.filter((tag) => product.tags.includes(tag)).length +
        (candidate.shipFrom === product.shipFrom ? 1 : 0)
    }))
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price);

  return scored.slice(0, limit).map((item) => item.product);
}

export function listActivePromotions(subtotal?: number) {
  return coupons
    .filter((coupon) => coupon.active)
    .map((coupon) => ({
      ...coupon,
      eligible: subtotal === undefined || !coupon.minSubtotal || subtotal >= coupon.minSubtotal
    }));
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
  const customer = upsertCustomer(input.customer);
  const order: Order = {
    customerId: customer.id,
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

export function updateOrderStatus(input: {
  id: string;
  status: Order["status"];
  paymentStatus?: Order["paymentStatus"];
  fulfillmentStatus?: Order["fulfillmentStatus"];
}) {
  const order = orders.find((item) => item.id === input.id);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = input.status;
  if (input.paymentStatus) order.paymentStatus = input.paymentStatus;
  if (input.fulfillmentStatus) order.fulfillmentStatus = input.fulfillmentStatus;

  if (input.status === "paid") {
    order.paymentStatus = "paid";
    order.fulfillmentStatus = order.fulfillmentStatus === "fulfilled" ? "fulfilled" : "unfulfilled";
  }
  if (input.status === "cancelled") {
    order.paymentStatus = order.paymentStatus === "paid" ? "refunded" : "failed";
  }
  if (input.status === "refunded") {
    order.paymentStatus = "refunded";
  }

  return order;
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

export function updateInventory(input: { productId: string; stock: number; reserved?: number }) {
  const product = getProduct(input.productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const reserved = input.reserved ?? product.reserved;
  if (reserved > input.stock) {
    throw new Error("Reserved quantity cannot exceed stock");
  }

  product.stock = input.stock;
  product.reserved = reserved;
  return {
    productId: product.id,
    sku: product.sku,
    title: product.title,
    stock: product.stock,
    reserved: product.reserved,
    available: product.stock - product.reserved,
    shipFrom: product.shipFrom
  };
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

export function getPageContent() {
  return pageContent;
}

export function updatePageContent(input: PageContent) {
  pageContent.promoBar = input.promoBar;
  pageContent.hero = input.hero;
  pageContent.template = input.template;
  return pageContent;
}

export function updateSettings(input: Partial<StoreSettings>) {
  if (input.name !== undefined) settings.name = input.name;
  if (input.defaultCurrency !== undefined) settings.defaultCurrency = input.defaultCurrency;
  if (input.supportedCountries !== undefined) settings.supportedCountries = input.supportedCountries;
  if (input.taxRate !== undefined) settings.taxRate = input.taxRate;
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

function upsertCustomer(address: Address) {
  const email = address.email?.toLowerCase();
  const existing = email ? customers.find((customer) => customer.email.toLowerCase() === email) : undefined;

  if (existing) {
    existing.name = address.name;
    existing.phone = address.phone;
    existing.country = address.country;
    return existing;
  }

  const customer: Customer = {
    id: `cus_${Date.now()}`,
    name: address.name,
    email: email ?? `${Date.now()}@guest.local`,
    phone: address.phone,
    country: address.country,
    createdAt: new Date().toISOString()
  };
  customers.unshift(customer);
  return customer;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
