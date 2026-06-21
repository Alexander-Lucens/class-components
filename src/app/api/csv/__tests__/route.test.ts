import { describe, expect, it } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "../route";

function makeRequest(items: string) {
  const formData = new FormData();
  formData.set("items", items);
  return new Request("http://localhost/api/csv", {
    method: "POST",
    body: formData,
  }) as unknown as NextRequest;
}

describe("POST /api/csv", () => {
  it("returns a downloadable CSV for valid items", async () => {
    const items = JSON.stringify([
      {
        name: "pikachu",
        url: "https://pokeapi.co/api/v2/pokemon/25/",
        description: "a, mouse",
      },
    ]);
    const res = await POST(makeRequest(items));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    expect(res.headers.get("content-disposition")).toContain(
      'filename="1_pokemon.csv"',
    );

    const body = await res.text();
    expect(body).toContain("name,description,url");
    expect(body).toContain('"a, mouse"');
  });

  it("returns only the header for invalid JSON input", async () => {
    const res = await POST(makeRequest("not-json"));
    const body = await res.text();

    expect(body).toBe("name,description,url");
    expect(res.headers.get("content-disposition")).toContain('"0_pokemon.csv"');
  });

  it("ignores malformed, null and primitive entries", async () => {
    const res = await POST(
      makeRequest(JSON.stringify([null, 5, { name: 1 }, { name: "x", url: "/x" }])),
    );
    const body = await res.text();

    expect(body).toContain("x,,/x");
  });

  it("returns only the header for non-array JSON", async () => {
    const res = await POST(makeRequest("{}"));
    expect(await res.text()).toBe("name,description,url");
  });

  it("returns only the header when the items field is missing", async () => {
    const request = new Request("http://localhost/api/csv", {
      method: "POST",
      body: new FormData(),
    }) as unknown as NextRequest;
    const res = await POST(request);
    expect(await res.text()).toBe("name,description,url");
  });
});
