import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const { replace, login } = vi.hoisted(() => ({ replace: vi.fn(), login: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("@/lib/auth", () => ({ login }));

import { LoginForm } from "@/components/login-form";

test("validates and submits the login form", async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect(screen.getByRole("alert")).toHaveTextContent("valid email");
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ADMIN@EXAMPLE.COM" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
  login.mockResolvedValueOnce({});
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  await waitFor(() => expect(login).toHaveBeenCalledWith("admin@example.com", "secret"));
  expect(replace).toHaveBeenCalledWith("/dashboard");
});
