"use client";

import { useActionState } from "react";
import { categories } from "@/lib/site";
import type { Artwork } from "@/lib/api";

type FormState = { error?: string } | undefined;

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  artwork?: Artwork;
  submitLabel: string;
};

const inputClass = "border border-line rounded px-3 py-2";

export default function ArtworkForm({ action, artwork, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 text-sm">
      {artwork && <input type="hidden" name="id" value={artwork.id} />}
      <label className="flex flex-col gap-1">
        Title
        <input name="title" required defaultValue={artwork?.title} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Category
        <select name="category" required defaultValue={artwork?.category} className={inputClass}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Medium
        <input name="medium" required defaultValue={artwork?.medium} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Dimensions
        <input name="dimensions" required defaultValue={artwork?.dimensions} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Materials
        <input name="materials" required defaultValue={artwork?.materials} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Tools (optional)
        <input name="tools" defaultValue={artwork?.tools} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        About this piece
        <textarea
          name="description"
          rows={4}
          required
          defaultValue={artwork?.description}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        Price
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={artwork?.price}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        {artwork
          ? `Add more photos (currently ${artwork.images.length})`
          : "Photos (the first one is the cover)"}
        <input name="images" type="file" accept="image/*" multiple className={inputClass} />
      </label>
      {state?.error && <p className="text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}