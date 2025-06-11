import puppeteer from "puppeteer";
import Influencer from "../models/Influencer.js";

async function scrapeInstagram() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto("https://www.instagram.com/explore/tags/tech/", {
      waitUntil: "networkidle2",
    });
    const profiles = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/p/"]')).map(
        (a) => a.href
      );
      return links.slice(0, 10);
    });

    for (const postUrl of profiles) {
      await page.goto(postUrl, { waitUntil: "networkidle2" });
      const data = await page.evaluate(() => {
        const username = document.querySelector('a[href*="/"]').innerText;
        const followers =
          parseInt(
            document
              .querySelector('span[title*="followers"]')
              .title.replace(/,/g, "")
          ) || 0;
        const likes =
          parseInt(
            document
              .querySelector('span[class*="like"]')
              .innerText.replace(/,/g, "")
          ) || 0;
        const comments =
          parseInt(
            document
              .querySelector('span[class*="comment"]')
              .innerText.replace(/,/g, "")
          ) || 0;
        const caption = document.querySelector(
          'div[class*="caption"]'
        ).innerText;
        return { username, followers, likes, comments, caption };
      });

      if (data.followers >= 40000 && data.followers <= 100000) {
        const engagement_rate =
          ((data.likes + data.comments) / data.followers) * 100;
        await Influencer.updateOne(
          { handle: data.username, platform: "Instagram" },
          {
            handle: data.username,
            platform: "Instagram",
            niche: "tech",
            followers: data.followers,
            engagement_rate,
            posts: [
              {
                id: postUrl,
                likes: data.likes,
                comments: data.comments,
                caption: data.caption,
              },
            ],
            last_updated: new Date().toISOString(),
          },
          { upsert: true }
        );
        console.log(`Saved Instagram influencer: ${data.username}`);
      }
    }
  } catch (err) {
    console.error("Instagram scrape error:", err);
  } finally {
    await browser.close();
  }
}

scrapeInstagram();
