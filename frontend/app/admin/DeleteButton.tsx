"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Delete this artwork? This can't be undone.")) {
          e.preventDefault();
        }
      }}
      className="text-sm text-red-700 border border-line rounded px-2 py-1"
    >
      Delete
    </button>
  );
}