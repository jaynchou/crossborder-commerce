import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { money } from "@/components/Money";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  findCategoryPageBySlug,
  getSettings,
  listCategories,
  listCategoryPages,
  listCoupons,
  listProducts,
  listShippingRates
} from "@/lib/store";

export const revalidate = 3600;

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return listCategoryPages().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = findCategoryPageBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return {
    title: `${category.name} products`,
    description: category.description,
    alternates: {
      canonical: `/${category.slug}`
    },
    openGraph: {
      title: `${category.name} products`,
      description: category.description,
      type: "website",
      images: [{ url: category.image, alt: category.name }]
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categories = listCategories();
  const category = findCategoryPageBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const settings = getSettings();
  const products = listProducts().filter((product) => product.category === category.name);
  const coupons = listCoupons();
  const shippingRates = listShippingRates();

  return (
    <main className="productDetailPage">
      <div className="promoBar">
        <span>Category shipping estimates available at checkout</span>
        <span>Promotions apply automatically when eligible</span>
      </div>
      <SiteHeader
        storeName={settings.name}
        categories={categories}
        featuredProducts={products}
        coupons={coupons}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} />

      <section className="retailSection categoryLanding">
        <div className="retailSectionHeader splitHeader">
          <div>
            <span className="microLabel">Collection</span>
            <h1>{category.name}</h1>
          </div>
          <p>{category.description}</p>
        </div>
        <div className="categoryHeroImage">
          <img src={category.image} alt={category.name} />
        </div>

        {products.length ? (
          <div className="productShelf">
            {products.map((product) => (
              <article className="retailProductCard" key={product.id}>
                <Link className="retailProductImage" href={`/products/${product.id}`}>
                  <img alt={product.title} src={product.images[0]} />
                  <span>{product.category}</span>
                </Link>
                <div className="retailProductBody">
                  <div>
                    <Link href={`/products/${product.id}`}><h3>{product.title}</h3></Link>
                    <p>{product.subtitle ?? product.description}</p>
                  </div>
                  <div className="priceRow">
                    <strong>{money(product.price, product.currency)}</strong>
                    {product.originalPrice ? <del>{money(product.originalPrice, product.currency)}</del> : null}
                  </div>
                  <Link className="outlineButton" href={`/products/${product.id}`}>View product</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="emptyState">
            <h2>No active products yet</h2>
            <p>This category is ready for merchandising once products are published.</p>
          </section>
        )}
      </section>

      <SiteFooter settings={settings} coupons={coupons} shippingRates={shippingRates} />
    </main>
  );
}
