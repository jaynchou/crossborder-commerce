import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import {
  getProduct,
  getSettings,
  listActivePromotions,
  listCategories,
  listProductReviews,
  listProductVariants,
  listRelatedProducts,
  listShippingRates
} from "@/lib/store";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={product}
      variants={listProductVariants(product.id)}
      relatedProducts={listRelatedProducts(product.id)}
      reviews={listProductReviews(product.id)}
      coupons={listActivePromotions()}
      shippingRates={listShippingRates()}
      settings={getSettings()}
      categories={listCategories()}
    />
  );
}
