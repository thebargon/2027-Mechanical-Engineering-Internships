import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { emptySnapshot, reconcile } from "./history";
import { renderBrowser } from "./site";

// Minimal in-memory document for exercising the generated script without a browser.
function setup() {
  const jobs = [
    { companyName: "Alpha", companyUrl: null, title: "Mechanical Intern 2027", location: "Boston", url: "https://example.com/1", source: "Lever", postedAt: null, ageDays: null, category: "mechanical_design", score: 5 },
    { companyName: "Beta", companyUrl: null, title: "Thermal Intern 2026", location: "Austin", url: "https://example.com/2", source: "Lever", postedAt: null, ageDays: null, category: "thermal_fluids", score: 4 },
  ];
  const snapshot = reconcile(emptySnapshot(), jobs, [], "2026-09-04T00:00:00Z");
  class Element {
    textContent = ""; className = ""; value = ""; checked = false;
    children: Element[] = []; handlers: Record<string, Function> = {};
    append(...children: Element[]) { this.children.push(...children); }
    replaceChildren(...children: Element[]) { this.children = children; }
    addEventListener(name: string, handler: Function) { this.handlers[name] = handler; }
    reset() { for (const id of ["search", "company", "category", "location"]) nodes[id].value = ""; nodes.term.value = "current"; }
  }
  const nodes = Object.fromEntries(["data", "search", "company", "category", "location", "term", "archive", "count", "results", "health", "filters", "reset"].map((id) => [id, new Element()]));
  nodes.data.textContent = JSON.stringify(snapshot);
  nodes.term.value = "current";
  const html = renderBrowser(snapshot);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  expect(script).toBeDefined();
  runInNewContext(script!, { document: { getElementById: (id: string) => nodes[id], createElement: () => new Element() }, URL, Date });
  return nodes;
}
test("browsing defaults to current term and supports search, company, location, and reset", () => {
  const nodes = setup();
  expect(nodes.results.children).toHaveLength(1);
  nodes.term.value = "all";
  nodes.filters.handlers.input();
  expect(nodes.results.children).toHaveLength(2);
  nodes.search.value = "THERMAL";
  nodes.filters.handlers.input();
  expect(nodes.count.textContent).toBe("1 matching listing");
  nodes.company.value = "Alpha";
  nodes.filters.handlers.input();
  expect(nodes.count.textContent).toBe("0 matching listings");
  expect(nodes.results.children[0].textContent).toContain("No listings match");
  nodes.reset.handlers.click();
  expect(nodes.count.textContent).toBe("1 matching listing");
  nodes.location.value = "Austin";
  nodes.filters.handlers.input();
  expect(nodes.count.textContent).toBe("0 matching listings");
});
