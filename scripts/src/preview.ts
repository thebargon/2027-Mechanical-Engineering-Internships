import path from "node:path";
const page = path.resolve(import.meta.dir, "../../docs/index.html");
const server = Bun.serve({ hostname: "127.0.0.1", port: 4173, fetch(request) {
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "/index.html") return new Response("Not found", { status: 404 });
  return new Response(Bun.file(page), { headers: { "Content-Type": "text/html; charset=utf-8" } });
}});
console.log(`Local: ${server.url}`);
