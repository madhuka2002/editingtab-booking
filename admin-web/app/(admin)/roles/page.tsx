import { UnsupportedState } from "@/components/states";

export default function RolesPage(){return <div className="stack"><div className="page-heading"><div><h1>Roles</h1><p className="muted">Organization roles and permissions</p></div></div><UnsupportedState>Platform Core exposes no role or permission APIs. Listing, creation, editing, deletion, and permission assignment are unavailable.</UnsupportedState><section className="card"><h2>Role controls</h2><div className="topbar-actions"><button disabled>Create role</button><button disabled className="secondary">Edit role</button><button disabled className="danger">Delete role</button></div></section></div>;}

