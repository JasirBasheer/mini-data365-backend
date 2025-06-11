import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema({
  handle: { type: String, required: true },
  platform: { type: String, enum: ["Instagram", "YouTube"], required: true },
  niche: { type: String, default: "tech" },
  followers: { type: Number, required: true },
  engagement_rate: { type: Number },
  audience: {
    age: [String],
    gender: String,
    location: String,
  },
  posts: [{ id: String, likes: Number, comments: Number, caption: String }],
  fraud_score: { type: Number, default: 0 },
  last_updated: { type: String },
});

export default mongoose.model("Influencer", influencerSchema);
