import Link from "next/link";
import { SectionList } from "@/frontend/section-list";
import { loadCatalog } from "@/backend/catalog";

export default async function AdminHomepagePage() {
  const { heroSlides, homepageSections, products } = await loadCatalog();
  const sections = [...homepageSections].sort((a, b) => a.order - b.order);
  const slides = [...heroSlides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Homepage</h1>
          <p>Change the banner and the sections that appear on the shop home.</p>
        </div>
      </div>

      <article className="admin-card" style={{ marginBottom: "0.9rem" }}>
        <div className="admin-card-head">
          <h2>Banners</h2>
          <Link className="admin-btn admin-btn-primary" href="/admin/homepage/banners/new">
            Add banner
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Link</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id}>
                  <td>
                    <div className="admin-product">
                      {slide.image ? <img src={slide.image} alt="" /> : <span className="admin-thumb" />}
                      <div>
                        <strong>{slide.heading}</strong>
                        <div className="admin-muted">{slide.campaign || slide.text}</div>
                      </div>
                    </div>
                  </td>
                  <td className="admin-muted">{slide.ctaHref}</td>
                  <td>
                    <span className={`admin-badge ${slide.active !== false ? "is-in" : "is-out"}`}>
                      {slide.active !== false ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <Link className="admin-link-btn admin-btn-ghost" href={`/admin/homepage/banners/${slide.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="admin-card">
        <div className="admin-card-head">
          <h2>Sections</h2>
          <Link className="admin-btn admin-btn-primary" href="/admin/homepage/sections/new">
            Add section
          </Link>
        </div>
        <SectionList sections={sections} products={products} />
      </article>
    </>
  );
}
