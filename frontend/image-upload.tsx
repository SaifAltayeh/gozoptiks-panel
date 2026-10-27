"use client";

import { useState } from "react";

const accept = "image/jpeg,image/png,image/webp,image/gif,image/avif";

async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) throw new Error(data.error || "Upload failed.");
  return data.url;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 16V5M8 8.5 12 4.5 16 8.5" />
      <path d="M5 16.5V19h14v-2.5" />
    </svg>
  );
}

export function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  async function onPick(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      <label
        className={`admin-drop${value ? " has-image" : ""}${over ? " is-over" : ""}${busy ? " is-busy" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          void onPick(event.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept={accept}
          onChange={(event) => {
            void onPick(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {value ? <img src={value} alt="" /> : null}
        <span className="admin-drop-copy">
          <UploadIcon />
          <strong>{busy ? "Adding photo…" : value ? "Change photo" : "Choose a photo"}</strong>
          <small>{busy ? "Please wait" : "Click here or drop a file from your computer"}</small>
        </span>
      </label>
      {value ? (
        <button type="button" className="admin-drop-clear" onClick={() => onChange("")}>
          Remove photo
        </button>
      ) : null}
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  );
}

export function ImageGalleryUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  async function onPick(files: FileList | File[] | null) {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of list) uploaded.push(await uploadFile(file));
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add those photos.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      {value.length ? (
        <div className="admin-upload-grid">
          {value.map((url) => (
            <div className="admin-upload-tile" key={url}>
              <img src={url} alt="" />
              <button type="button" onClick={() => onChange(value.filter((item) => item !== url))} aria-label="Remove photo">
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <label
        className={`admin-drop${over ? " is-over" : ""}${busy ? " is-busy" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          void onPick(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple
          onChange={(event) => {
            void onPick(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="admin-drop-copy">
          <UploadIcon />
          <strong>{busy ? "Adding photos…" : "Add photos"}</strong>
          <small>{busy ? "Please wait" : "Click or drop one or more photos from your computer"}</small>
        </span>
      </label>
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  );
}
