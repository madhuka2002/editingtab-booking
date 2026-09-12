export function StatusBadge({ active }: { active: boolean }) { return <span className={`status ${active ? "active" : "inactive"}`}>{active ? "Active" : "Inactive"}</span>; }
export function LoadingState({ label = "Loading…" }: { label?: string }) { return <p className="muted">{label}</p>; }
export function EmptyState({ children }: { children: React.ReactNode }) { return <div className="empty">{children}</div>; }
export function ErrorState({ message }: { message: string }) { return <div role="alert" className="error-banner">{message}</div>; }
export function UnsupportedState({ children }: { children: React.ReactNode }) { return <div className="notice"><strong>Not implemented by backend.</strong> {children}</div>; }
export function PermissionDenied() { return <ErrorState message="Permission denied. Your account is not authorized for this page." />; }

