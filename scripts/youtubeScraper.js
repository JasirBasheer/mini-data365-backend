import axios from "axios";
import Influencer from "../models/Influencer.js";
import dotenv from "dotenv";

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function fetchTechInfluencers() {
  try {
    const searchRes = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        q: "tech review | gadgets | AI",
        type: "channel",
        maxResults: 50,
        key: YOUTUBE_API_KEY,
      },
    });

    const channels = searchRes.data.items;
    for (const channel of channels) {
      const channelId = channel.id.channelId;
      const channelRes = await axios.get(`${BASE_URL}/channels`, {
        params: {
          part: "statistics,snippet",
          id: channelId,
          key: YOUTUBE_API_KEY,
        },
      });

      const stats = channelRes.data.items[0].statistics;
      const followers = parseInt(stats.subscriberCount);
      if (followers >= 40000 && followers <= 100000) {
        const videosRes = await axios.get(`${BASE_URL}/videos`, {
          params: {
            part: "statistics,snippet",
            channelId: channelId,
            maxResults: 5,
            key: YOUTUBE_API_KEY,
          },
        });

        const posts = videosRes.data.items.map((video) => ({
          id: video.id,
          likes: parseInt(video.statistics.likeCount || 0),
          comments: parseInt(video.statistics.commentCount || 0),
          caption: video.snippet.title,
        }));

        const engagement_rate =
          posts.reduce(
            (acc, post) =>
              acc + ((post.likes + post.comments) / followers) * 100,
            0
          ) / posts.length;

        await Influencer.updateOne(
          {
            handle: channelRes.data.items[0].snippet.title,
            platform: "YouTube",
          },
          {
            handle: channelRes.data.items[0].snippet.title,
            platform: "YouTube",
            niche: "tech",
            followers,
            engagement_rate,
            posts,
            last_updated: new Date().toISOString(),
          },
          { upsert: true }
        );
        console.log(
          `Saved YouTube influencer: ${channelRes.data.items[0].snippet.title}`
        );
      }
    }
  } catch (err) {
    console.error("YouTube fetch error:", err);
  }
}

fetchTechInfluencers();
