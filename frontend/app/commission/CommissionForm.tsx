"use client";

import { useActionState } from "react";
import { categories } from "@/lib/site";
import { submitCommission } from "./actions";

const inputClass = "border border-line rounded px-3 py-2";

export default function CommissionForm() {
  const [state, formAction, pending] = useActionState(submitCommission, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 text-sm">
      <label className="flex flex-col gap-1">
        What would you like made?
        <textarea name="description" rows={5} required className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        Preferred medium
        <select name="preferredMedium" required className={inputClass}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <div className="flex gap-4">
        <label className="flex flex-col gap-1 flex-1">
          Budget from ($)
          <input name="budgetMin" type="number" min="0" step="1" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 flex-1">
          Budget to ($)
          <input name="budgetMax" type="number" min="0" step="1" required className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        Needed by (optional)
        <input name="desiredDate" type="date" className={inputClass} />
      </label>
      {state?.error && <p className="text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}