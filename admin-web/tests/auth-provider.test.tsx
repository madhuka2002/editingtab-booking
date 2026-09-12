import { render, waitFor } from "@testing-library/react";

const { replace, getCurrentUser } = vi.hoisted(() => ({ replace:vi.fn(), getCurrentUser:vi.fn() }));
vi.mock("next/navigation",()=>({useRouter:()=>({replace})}));
vi.mock("@/lib/auth",()=>({getCurrentUser}));

import { AuthProvider } from "@/components/auth-provider";
import { ApiError } from "@/lib/types";

test("redirects an unauthorized session to login",async()=>{getCurrentUser.mockRejectedValueOnce(new ApiError(401,"Expired"));render(<AuthProvider><p>Protected</p></AuthProvider>);await waitFor(()=>expect(replace).toHaveBeenCalledWith("/login"));});
