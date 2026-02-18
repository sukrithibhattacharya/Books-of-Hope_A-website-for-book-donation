const mongoose = require("mongoose");

const featuredCampaignSchema = new mongoose.Schema({
    name: String,
    email: String,
    books: Number,
    campaignName: String,
    bookFilePath: String,
    date: { type: Date, default: Date.now } // Date of the donation
});

const FeaturedCampaign = mongoose.model("FeaturedCampaign", featuredCampaignSchema);

module.exports = FeaturedCampaign;
