import Link from "next/link";
import { getSession } from "@/lib/session";
import CommissionForm from "./CommissionForm";

export default async function CommissionPage() {
  const session = await getSession();

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Request a commission</h1>
      <p className="text-muted mb-6">
        Tell the artist what you have in mind. She'll review your request and reply
        with a quote.
      </p>
      {session ? (
        <CommissionForm />
      ) : (
        <p>
          <Link href="/login" className="underline">Log in</Link> or{" "}
          <Link href="/register" className="underline">create an account</Link> to
          send a request, so you can follow its progress.
        </p>
      )}
    </main>
  );
}