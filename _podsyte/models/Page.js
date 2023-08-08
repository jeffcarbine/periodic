import mongoose from "mongoose";
var Schema = mongoose.Schema;

export const wildcardEnum = [
  "none",
  "podcast",
  "episode",
  "product",
  "collection",
];

// define the schema for our user model
var Page = new Schema({
  name: String,
  path: String,
  wildcard: {
    type: String,
    enum: wildcardEnum,
    default: "none",
  },
  homepage: Boolean,
  datapoints: Array,
});

// create the model for users and expose it to our app
export default mongoose.model("Page", Page);