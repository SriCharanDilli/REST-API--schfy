const Circular = require("../models/Circular.models.js"); 
const asyncHandler = require("express-async-handler");

// @desc Get Circulars for each Paper
// @route GET /circulars/:paperId
// @access Everyone
const getCirculars = async (req, res) => {
  if (!req?.params?.paperId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const circulars = await Circular.find({
    paper: req.params.paperId,
  }).exec();
  if (!circulars) {
    return res.status(404).json({
      message: `No Circulars found for ${req.params.paperId}`,
    });
  }
  res.json(circulars);
};

// @desc Get Circular by ID
// @route GET /circulars/:circularId
// @access Everyone
const getCircular = async (req, res) => {
  if (!req?.params?.circularId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const circular = await Circular.findById(req.params.circularId).exec();
  if (!circular) {
    return res.status(404).json({
      message: `Circular Not Found for ID ${req.params.circularId}`,
    });
  }
  res.json(circular);
};

// @desc Add Circular
// @route POST /circulars
// @access Private
const addCircular = asyncHandler(async (req, res) => {
  const { paper, title, description } = req.body;

  // Confirm Data
  if (!paper || !title || !description) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Circular.findOne({
    paper,
    title,
    description,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Circular already exists" });
  }

  const circularObj = {
    paper,
    title,
    description,
  };

  // Create and Store New Circular
  const record = await Circular.create(circularObj);

  if (record) {
    res.status(201).json({
      message: `Circular Added Successfully`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Circular
// @route PATCH /circulars/:circularId
// @access Private
const updateCircular = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Confirm Data
  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const circular = await Circular.findById(req.params.circularId).exec();

  if (!circular) {
    return res.status(404).json({ message: "Circular doesn't exist" });
  }

  circular.title = title;
  circular.description = description;

  const savedCircular = await circular.save();
  if (savedCircular) {
    res.json({
      message: `Circular Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Circular
// @route DELETE /circulars/:circularId
// @access Private
const deleteCircular = asyncHandler(async (req, res) => {
  if (!req.params.circularId) {
    return res.status(400).json({ message: "Circular ID required" });
  }

  const circular = await Circular.findById(req.params.circularId).exec();

  if (!circular) {
    return res.status(404).json({ message: "Circular not found" });
  }

  await circular.deleteOne();

  res.json({
    message: `Circular Deleted`,
  });
});

module.exports = {
  getCirculars,
  getCircular,
  addCircular,
  updateCircular,
  deleteCircular,
};
