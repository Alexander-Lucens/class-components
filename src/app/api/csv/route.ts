import type { NextRequest } from "next/server";
import type Pokemon from "../../../interfaces/Pokemon";
import { buildCsv } from "../../../utils/csv";

function toPokemon(value: unknown): Pokemon | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.name !== "string" || typeof record.url !== "string") {
    return null;
  }
  return {
    name: record.name,
    url: record.url,
    description:
      typeof record.description === "string" ? record.description : "",
  };
}

export async function POST(request: NextRequest): Promise<Response> {
  const formData = await request.formData();

  let parsed: unknown = [];
  try {
    parsed = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    parsed = [];
  }

  const items: Pokemon[] = Array.isArray(parsed)
    ? parsed
        .map(toPokemon)
        .filter((item): item is Pokemon => item !== null)
    : [];

  const csv = buildCsv(items);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${items.length}_pokemon.csv"`,
    },
  });
}
