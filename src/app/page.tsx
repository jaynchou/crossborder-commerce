import Link from "next/link";
import { listProducts } from "@/lib/store";

export default function StorefrontPage() {
  const products = listProducts();
  const featured = products.filter((product) => product.featured);

  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <strong>{process.env.NEXT_PUBLIC_STORE_NAME ?? "CrossBorder Commerce"}</strong>
          <div>
            <a href="#products">商品</a>
            <Link href="/admin">Admin</Link>
          </div>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">Cross-border commerce starter</p>
          <h1>Launch first, choose the winning products later.</h1>
          <p>
            A portable commerce backend for product discovery, checkout, inventory, shipping, tax,
            orders, and fulfillment. Deploy on Vercel now, move to any Docker cloud later.
          </p>
          <div className="actions">
            <a className="primaryButton" href="#products">Browse catalog</a>
            <Link className="secondaryButton" href="/admin">Open admin</Link>
          </div>
        </div>
      </section>

      <section className="section" id="products">
        <div className="sectionHeader">
          <p className="eyebrow">Featured products</p>
          <h2>Starter catalog</h2>
        </div>
        <div className="grid">
          {featured.map((product) => (
            <article className="productCard" key={product.id}>
              <div className="productImage">
                <img alt={product.title} src={product.images[0]} />
              </div>
              <div className="productBody">
                <div className="tagRow">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="priceRow">
                  <strong>${product.price}</strong>
                  {product.originalPrice ? <del>${product.originalPrice}</del> : null}
                </div>
                <button>Add to cart</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
