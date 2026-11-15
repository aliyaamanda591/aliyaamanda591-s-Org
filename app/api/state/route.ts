import { authenticatedUser, readState, writeState } from "@/lib/account-store";
export const dynamic = "force-dynamic";
const json = (value: unknown, status=200) => Response.json(value, { status, headers: { "Cache-Control": "private, no-store" } });
export async function GET() {
  try { const user = await authenticatedUser(); return json(await readState(user)); }
  catch (error) { if (error instanceof Response) return error; return json({ error: "Data belum dapat dimuat." }, 503); }
}
export async function PUT(request: Request) {
  try {
    const user = await authenticatedUser();
    if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Permintaan tidak diizinkan." }, 403);
    const text = await request.text(); if (text.length > 2000000) return json({ error: "Data terlalu besar." }, 413);
    const body = JSON.parse(text); if (!Number.isSafeInteger(body.revision) || body.revision < 0) return json({ error: "Versi data tidak valid." }, 400);
    const revision = await writeState(user, body.state, body.revision);
    return revision === null ? json({ error: "Data berubah di tab/perangkat lain. Muat ulang sebelum melanjutkan." }, 409) : json({ revision });
  } catch (error) { if (error instanceof Response) return error; return json({ error: error instanceof Error ? error.message : "Data belum dapat disimpan." }, 400); }
}
