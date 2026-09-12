import { responseData } from "@/lib/types";

test.each([[401,"Expired"],[403,"Permission denied"],[404,"Missing"]])("preserves HTTP %i errors", async (status, detail) => {
  await expect(responseData(new Response(JSON.stringify({ detail }), { status }))).rejects.toMatchObject({ status, message: detail });
});

test("formats backend field validation", async () => {
  const response = new Response(JSON.stringify({ detail: [{ loc: ["body","slug"], msg: "Invalid slug" }] }), { status: 422 });
  await expect(responseData(response)).rejects.toThrow("slug: Invalid slug");
});
