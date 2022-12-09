const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema(
  {
    adult: {
      type: Boolean,
      default: false,
    },
    backdropPath: String,
    genres: [Number],
    originalLanguage: String,
    originalTitle: String,
    overview: {
      type: String,
      maxLength: [
        500,
        "Movie Overview length cannot exceed more than 500 characters",
      ],
    },
    popularity: Number,
    posterPath: String,
    releaseDate: String,
    title: String,
    video: Boolean,
    voteAverage: Number,
    voteCount: Number,
    isTrending: Boolean,
    isNowPlaying: Boolean,
    tmdbId: String,
  },
  { timestamps: true }
);

const Movie = mongoose.model("movie", MovieSchema);
module.exports = Movie;
