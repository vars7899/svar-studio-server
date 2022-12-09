const mongoose = require("mongoose");

const TheatreSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      maxLength: [
        150,
        "Theatre name should be less than equal to 150 characters",
      ],
      unique: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      autopopulate: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movie",
        autopopulate: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
TheatreSchema.plugin(require("mongoose-autopopulate"));

const Theatre = mongoose.model("theatre", TheatreSchema);
module.exports = Theatre;
