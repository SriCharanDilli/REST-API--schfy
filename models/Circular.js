const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema(
  {
    parentCircular: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circular",
    },
    department: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Additional fields can be added as needed
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Circular", circularSchema);