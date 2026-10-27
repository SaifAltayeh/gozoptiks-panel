/**
 * gözoptik admin panel backend
 *
 * The panel reads and writes through the API in GozOptiks-Back-End.
 */
export { loadCatalog } from "@/backend/catalog";
export { ADMIN_COOKIE, getAdminPassword, getAdminToken, isAdminToken } from "@/backend/auth";
