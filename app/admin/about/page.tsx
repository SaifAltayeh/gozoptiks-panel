import { AboutForm } from "@/frontend/about-form";
import { loadCatalog } from "@/backend/catalog";

export default async function AdminAboutPage() {
  const { about } = await loadCatalog();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>About Us</h1>
          <p>This copy and these images appear on the shop About page.</p>
        </div>
      </div>
      <AboutForm about={about} />
    </>
  );
}
