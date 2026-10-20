"use client";

import { useActionState } from "react";
import { createArtwork } from "../actions";
import { categories } from "@/lib/site";

const inputClass = "border border-line rounded px-3 py-2";

export default function NewArtworkForm() {
  const [state, formAction, pending] = useActionState(createArtwork, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 text-sm">
      <label className="flex flex-col gap-1">
        Title
        <input name="title" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Category
        <select name="category" required className={inputClass}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Medium
        <input name="medium" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Dimensions
        <input name="dimensions" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Materials
        <input name="materials" required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Tools (optional)
        <input name="tools" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        About this piece
        <textarea name="description" rows={4} required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Photos (the first one is the cover)
        <input name="images" type="file" accept="image/*" multiple className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Price
        <input name="price" type="number" min="0" step="0.01" required className={inputClass} />
      </label>
      {state?.error && <p className="text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save artwork"}
      </button>
    </form>
  );
}