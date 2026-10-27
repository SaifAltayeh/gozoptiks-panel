import { BannerForm } from "@/frontend/banner-form";

export default function NewBannerPage() {
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>New banner</h1>
          <p>This slide appears in the homepage hero.</p>
        </div>
      </div>
      <BannerForm />
    </>
  );
}
