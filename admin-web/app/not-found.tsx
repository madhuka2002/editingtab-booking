import Link from "next/link";

export default function NotFound() {
  return <main className="center-card"><section className="card"><h1>Page not found</h1><p>The requested admin page does not exist.</p><Link className="button-link" href="/dashboard">Return to dashboard</Link></section></main>;
}

