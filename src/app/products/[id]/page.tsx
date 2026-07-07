import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import {
  getProduct,
  getSettings,
  listActivePromotions,
  listCategories,
  listProductReviews,
  listProducts,
  listProductVariants,
  listRelatedProducts,
  listShippingRates
} from "@/lib/store";

export const revalidate = 3600;

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listProducts().map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return {
      title: "Product not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: `/products/${product.id}`
    },
    openGraph: {
      title: product.title,
      description: product.description,
      type: "website",
      images: product.images.map((image) => ({
        url: image,
        alt: product.title
      }))
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const reviews = listProductReviews(product.id);
  const aggregateRating = reviews.length
    ? {
        "@type": "AggregateRating",
        ratingValue: (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1),
        reviewCount: reviews.length
      }
    : undefined;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.sku,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: getSettings().name
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.stock - product.reserved > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `/products/${product.id}`
    },
    ...(aggregateRating ? { aggregateRating } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        variants={listProductVariants(product.id)}
        relatedProducts={listRelatedProducts(product.id)}
        reviews={reviews}
        coupons={listActivePromotions()}
        shippingRates={listShippingRates()}
        settings={getSettings()}
        categories={listCategories()}
      />
    </>
  );
}
