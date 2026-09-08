const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ASSETS_DIR = path.resolve(__dirname, "../../assets");

const targets = [
  { url: "http://localhost:3000/showcase/board", output: "mino_board.png", width: 1200, height: 780 },
  { url: "http://localhost:3000/showcase/dashboard", output: "mino_dashboard.png", width: 1200, height: 750 },
  { url: "http://localhost:3000/showcase/org", output: "mino_org.png", width: 1200, height: 700 },
  { url: "http://localhost:3000/showcase/settings", output: "mino_settings.png", width: 1200, height: 800 },
];

async function capture() {
  console.log("Launching Chrome at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  for (const t of targets) {
    console.log(`Navigating to ${t.url}...`);
    await page.goto(t.url, { waitUntil: "networkidle0", timeout: 30000 });
    
    // Wait for window wrapper to be present
    await page.waitForSelector(".rounded-2xl.border", { timeout: 10000 });
    // Brief sleep for animations / font rendering
    await new Promise((r) => setTimeout(r, 1200));

    // Select the macOS window card inside WindowWrapper
    const element = await page.$(".rounded-2xl.border");
    const outputPath = path.join(ASSETS_DIR, t.output);

    if (element) {
      console.log(`Taking element screenshot: ${outputPath}`);
      await element.screenshot({ path: outputPath, type: "png" });
    } else {
      console.log(`Fallback: taking viewport screenshot: ${outputPath}`);
      await page.screenshot({ path: outputPath, type: "png" });
    }
    console.log(`Successfully saved ${t.output}`);
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
