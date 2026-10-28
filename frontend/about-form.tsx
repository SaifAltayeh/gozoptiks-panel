"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/frontend/api";
import { ImageUpload } from "@/frontend/image-upload";
import type { AboutContent, AboutLocale } from "@/backend/models";

function localeToFields(locale: AboutLocale) {
  return {
    ...locale,
    paragraphsText: locale.paragraphs.join("\n\n"),
    promisesText: locale.promises.map((item) => `${item.title} | ${item.text}`).join("\n"),
  };
}

function fieldsToLocale(fields: ReturnType<typeof localeToFields>): AboutLocale {
  return {
    title: fields.title,
    tagline: fields.tagline,
    kicker: fields.kicker,
    langLabel: fields.langLabel,
    promiseTitle: fields.promiseTitle,
    close: fields.close,
    paragraphs: fields.paragraphsText
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean),
    promises: fields.promisesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: title.trim(), text: rest.join("|").trim() };
      }),
  };
}

export function AboutForm({ about }: { about: AboutContent }) {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState(about.heroImage);
  const [storyImage, setStoryImage] = useState(about.storyImage);
  const [en, setEn] = useState(localeToFields(about.en));
  const [ar, setAr] = useState(localeToFields(about.ar));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest("/api/about", {
        method: "PUT",
        body: JSON.stringify({
          heroImage,
          storyImage,
          en: fieldsToLocale(en),
          ar: fieldsToLocale(ar),
        }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save About Us.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <article className="admin-card">
        <div className="admin-card-head">
          <h2>Images</h2>
        </div>
        <div className="admin-fields">
          <ImageUpload label="Hero image" value={heroImage} onChange={setHeroImage} />
          <ImageUpload label="Story image" value={storyImage} onChange={setStoryImage} />
        </div>
      </article>

      <div className="admin-form-grid">
        <LocaleFields title="English" value={en} onChange={setEn} />
        <LocaleFields title="Arabic" value={ar} onChange={setAr} />
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save About Us"}
        </button>
      </div>
    </form>
  );
}

function LocaleFields({
  title,
  value,
  onChange,
}: {
  title: string;
  value: ReturnType<typeof localeToFields>;
  onChange: (next: ReturnType<typeof localeToFields>) => void;
}) {
  return (
    <article className="admin-card">
      <div className="admin-card-head">
        <h2>{title}</h2>
      </div>
      <div className="admin-fields">
        <div className="admin-field">
          <label>
            Title
            <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} />
          </label>
        </div>
        <div className="admin-field">
          <label>
            Kicker
            <input value={value.kicker} onChange={(event) => onChange({ ...value, kicker: event.target.value })} />
          </label>
        </div>
        <div className="admin-field">
          <label>
            Tagline
            <input value={value.tagline} onChange={(event) => onChange({ ...value, tagline: event.target.value })} />
          </label>
        </div>
        <div className="admin-field">
          <label>
            Story, blank line between paragraphs
            <textarea
              value={value.paragraphsText}
              onChange={(event) => onChange({ ...value, paragraphsText: event.target.value })}
            />
          </label>
        </div>
        <div className="admin-field">
          <label>
            Promise title
            <input value={value.promiseTitle} onChange={(event) => onChange({ ...value, promiseTitle: event.target.value })} />
          </label>
        </div>
        <div className="admin-field">
          <label>
            Promises, one `Title | text` per line
            <textarea
              value={value.promisesText}
              onChange={(event) => onChange({ ...value, promisesText: event.target.value })}
            />
          </label>
        </div>
        <div className="admin-field">
          <label>
            Closing line
            <input value={value.close} onChange={(event) => onChange({ ...value, close: event.target.value })} />
          </label>
        </div>
      </div>
    </article>
  );
}
