/**
 * Explore UI Libraries Built on shadcn
 * 
 * This script uses Firecrawl to explore popular UI component libraries
 * built on top of shadcn/ui to find unique components for the landing page.
 */

import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

async function exploreUILibrary(url: string, name: string) {
  console.log(`\n🔍 Exploring ${name}...`);
  console.log(`URL: ${url}\n`);
  
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });
    
    if (result.success) {
      console.log(`✅ Successfully scraped ${name}`);
      console.log(`\n--- ${name} Content ---\n`);
      console.log(result.markdown?.substring(0, 2000)); // First 2000 chars
      console.log("\n...\n");
      return result.markdown;
    } else {
      console.error(`❌ Failed to scrape ${name}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error scraping ${name}:`, error);
    return null;
  }
}

async function main() {
  console.log("🚀 Exploring UI Libraries Built on shadcn/ui\n");
  console.log("=" .repeat(60));
  
  // Explore ReactBits
  await exploreUILibrary("https://reactbits.dev", "ReactBits");
  
  // Explore MagicUI
  await exploreUILibrary("https://magicui.design", "MagicUI");
  
  // Explore Aceternity UI (another popular choice)
  await exploreUILibrary("https://ui.aceternity.com", "Aceternity UI");
  
  console.log("\n" + "=".repeat(60));
  console.log("\n✨ Exploration complete!");
  console.log("\nRecommendations:");
  console.log("- Look for animated components (hero sections, cards, backgrounds)");
  console.log("- Consider gradient effects and modern animations");
  console.log("- Use minimal, clean components that reduce visual clutter");
  console.log("- Focus on components that enhance the Louisiana educator story");
}

main().catch(console.error);
