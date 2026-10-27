import { cache } from "react";
import type { Database } from "@/backend/types";

const API_URL = process.env.API_URL || "http://localhost:4000";

export const loadCatalog = cache(async (): Promise<Database> => {
  const response = await fetch(`${API_URL}/api/catalog`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Catalog is unavailable.");
  }
  return (await response.json()) as Database;
});
