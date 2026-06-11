import type Pokemon from "../interfaces/Pokemon";

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv(items: Pokemon[]) {
  const headers = ["name", "description", "url"];
  const rows = items.map((p) => [p.name, p.description ?? "", p.url].map(escapeCsv).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export function exportSelectedToCsv(items: Pokemon[]) {
  const csv = buildCsv(items);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${items.length}_items.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default buildCsv;
