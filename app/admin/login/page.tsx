import { LoginForm } from "@/frontend/login-form";

export default function AdminLoginPage() {
  return (
    <div className="admin-root admin-login">
      <div className="admin-login-card">
        <small className="admin-muted">gözoptik panel</small>
        <h1>Sign in</h1>
        <p className="admin-muted">Manage the live catalog, brands, and incoming checkouts.</p>
        <LoginForm />
        <p className="admin-muted">Local default password is gozoptik unless ADMIN_PASSWORD is set.</p>
      </div>
    </div>
  );
}
