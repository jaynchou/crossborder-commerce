import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3100";
const adminToken = process.env.VISUAL_ADMIN_TOKEN ?? process.env.SMOKE_ADMIN_TOKEN;
const screenshotDir = path.join(process.cwd(), "tmp", "visual-smoke");

const routes = [
  { path: "/", name: "home", mustContain: ["CrossBorder Commerce"] },
  { path: "/apparel", name: "category-apparel", mustContain: ["Apparel", "Merino Travel Scarf"] },
  { path: "/products/album-cloud-001", name: "product", mustContain: ["Merino Travel Scarf", "Reviews"] },
  { path: "/cart", name: "cart", mustContain: ["Your cart"] },
  { path: "/checkout", name: "checkout", mustContain: ["Checkout"] },
  { path: "/admin", name: "admin", mustContain: ["Dashboard"], admin: true },
  { path: "/admin/content", name: "admin-content", mustContain: ["Content editor", "Homepage editor"], admin: true }
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 }
];

const failures = [];

function fileSafe(value) {
  return value.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const visibleElements = Array.from(document.body.querySelectorAll("*")).filter((element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number.parseFloat(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    });

    const overflowers = visibleElements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const scrollAncestor = (() => {
          let parent = element.parentElement;
          while (parent && parent !== document.body) {
            const style = window.getComputedStyle(parent);
            if (
              ["auto", "scroll"].includes(style.overflowX) &&
              parent.scrollWidth > parent.clientWidth
            ) {
              const parentRect = parent.getBoundingClientRect();
              return {
                left: Math.floor(parentRect.left),
                right: Math.ceil(parentRect.right)
              };
            }
            parent = parent.parentElement;
          }
          return null;
        })();
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className : "",
          text: element.textContent?.trim().slice(0, 80) ?? "",
          left: Math.floor(rect.left),
          right: Math.ceil(rect.right),
          width: Math.ceil(rect.width),
          scrollAncestor
        };
      })
      .filter((item) => item.right > viewportWidth + 2 || item.left < -2)
      .filter((item) => !(item.scrollAncestor && item.left >= item.scrollAncestor.left - 2))
      .slice(0, 8);

    const smallControls = Array.from(
      document.querySelectorAll("button:not([disabled]), input, select, textarea")
    )
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          type: element.getAttribute("type") ?? "",
          className: typeof element.className === "string" ? element.className : "",
          text: element.textContent?.trim().slice(0, 80) ?? element.getAttribute("aria-label") ?? "",
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
          visible:
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0
        };
      })
      .filter((item) => item.visible && !["radio", "checkbox"].includes(item.type))
      .filter((item) => item.width < 32 || item.height < 32)
      .slice(0, 8);

    const main = document.querySelector("main") ?? document.body;
    const mainRect = main.getBoundingClientRect();

    return {
      title: document.title,
      bodyTextLength: document.body.innerText.trim().length,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth,
      viewportHeight,
      mainWidth: Math.ceil(mainRect.width),
      mainHeight: Math.ceil(mainRect.height),
      overflowers,
      smallControls
    };
  });
}

await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });

    if (adminToken) {
      const response = await context.request.post(`${baseUrl}/api/admin/session`, {
        data: { token: adminToken }
      });
      if (!response.ok()) {
        failures.push(`${viewport.name}: admin login failed with ${response.status()}`);
      }
    }

    const page = await context.newPage();
    for (const route of routes) {
      const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
      if (!response?.ok()) {
        failures.push(`${viewport.name} ${route.path}: expected 2xx, got ${response?.status()}`);
        continue;
      }

      const html = await page.content();
      for (const expected of route.mustContain) {
        if (!html.includes(expected)) {
          failures.push(`${viewport.name} ${route.path}: missing text "${expected}"`);
        }
      }

      const layout = await inspectLayout(page);
      if (layout.bodyTextLength < 120) {
        failures.push(`${viewport.name} ${route.path}: page content looks too sparse`);
      }
      if (layout.mainWidth < Math.min(320, viewport.width - 24) || layout.mainHeight < 240) {
        failures.push(`${viewport.name} ${route.path}: main content has suspicious dimensions`);
      }
      if (layout.overflowers.length) {
        failures.push(
          `${viewport.name} ${route.path}: visible horizontal overflow ${JSON.stringify(
            layout.overflowers
          )}`
        );
      }
      if (layout.smallControls.length) {
        failures.push(
          `${viewport.name} ${route.path}: tiny interactive controls ${JSON.stringify(
            layout.smallControls
          )}`
        );
      }

      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.name}-${fileSafe(route.name)}.png`),
        fullPage: true
      });
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("Visual smoke failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error(`Screenshots saved to ${screenshotDir}`);
  process.exit(1);
}

console.log(`Visual smoke passed for ${routes.length} routes across ${viewports.length} viewports.`);
console.log(`Screenshots saved to ${screenshotDir}`);
