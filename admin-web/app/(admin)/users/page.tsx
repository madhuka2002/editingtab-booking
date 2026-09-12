import { UnsupportedState } from "@/components/states";

export default function UsersPage(){return <div className="stack"><div className="page-heading"><div><h1>Users</h1><p className="muted">Organization-level user management</p></div></div><UnsupportedState>Platform Core exposes no organization user list, create, update, deactivate, or role-assignment APIs. No frontend-only users are shown.</UnsupportedState><section className="card"><h2>User controls</h2><button disabled>Create user</button></section></div>;}

