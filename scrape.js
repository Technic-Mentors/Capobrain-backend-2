// scrape.js
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

export async function scrapeSite(urls) {
  if (!Array.isArray(urls)) urls = [urls];

  let fullText = "";

  for (const url of urls) {
    try {
      console.log("🔹 Scraping:", url);
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const text = $("body").text().replace(/\s+/g, " ").trim();
      fullText += text + "\n";
    } catch (err) {
      console.log("❌ Error crawling:", url, err.message);
    }
  }

  fs.writeFileSync("./website_data.txt", fullText);
  console.log("✅ Website content extracted & saved!");
  return fullText;
}
