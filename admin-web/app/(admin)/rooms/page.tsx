import Link from "next/link";

export default function RoomsPage(){return <div className="stack"><div className="page-heading"><h1>Rooms</h1></div><section className="card"><p>Physical rooms are scoped to a property. Open a property to list or create its rooms.</p><Link className="button-link" href="/properties">Choose property</Link></section></div>;}

