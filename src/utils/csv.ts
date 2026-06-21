import type Pokemon from "../interfaces/Pokemon";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv(items: Pokemon[]): string {
  const headers = ["name", "description", "url"];
  const rows = items.map((item) =>
    [item.name, item.description ?? "", item.url].map(escapeCsv).join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}
