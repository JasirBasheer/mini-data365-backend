import express from "express";
import Influencer from "../models/Influencer.js";
import { processQuery } from "../utils/mlUtils.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const { niche, min_followers, max_followers, platforms } =
      await processQuery(
        query ||
          "tech niche from 40k to 100k followers on Instagram and YouTube"
      );

    const influencers = await Influencer.find({
      niche,
      followers: { $gte: min_followers, $lte: max_followers },
      platform: { $in: platforms },
    }).limit(50);

    res.json(influencers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
