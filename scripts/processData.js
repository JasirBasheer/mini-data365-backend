import Influencer from "../models/Influencer.js";
import { detectNiche, detectFraud } from "../utils/mlUtils.js";

async function processInfluencers() {
  const influencers = await Influencer.find({});
  for (const inf of influencers) {
    const text = inf.posts[0]?.caption || inf.handle;
    const { niche } = await detectNiche(text);

    const follower_growth_rate = 0.05;
    const comment_to_like_ratio =
      inf.posts.reduce((acc, p) => acc + p.comments / (p.likes || 1), 0) /
      inf.posts.length;
    const { fraud_score } = await detectFraud({
      follower_growth_rate,
      engagement_rate: inf.engagement_rate,
      comment_to_like_ratio,
    });

    await Influencer.updateOne({ _id: inf._id }, { niche, fraud_score });
    console.log(`Processed: ${inf.handle} (${niche}, fraud: ${fraud_score})`);
  }
}

processInfluencers();
