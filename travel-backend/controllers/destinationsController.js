const Destination = require("../models/Destination");
const archiver = require("archiver");

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res, next) => {
  try {
    const { search, status, country, sort, userId } = req.query;

    const query = {};

    // Filter by user if userId is provided
    if (userId) query.userId = userId;

    // Filter by status
    if (status && status !== "all") query.status = status;

    // Filter by country
    if (country) query.country = country;

    // Search in title, country or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "alphabetical") sortOption = { title: 1 };

    const destinations = await Destination.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestination = async (req, res, next) => {
  try {
    console.log("Fetching destination with ID:", req.params.id);

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      console.log("Destination not found for ID:", req.params.id);
      return res.status(404).json({
        success: false,
        error: "Destination not found",
      });
    }

    console.log("Destination found:", destination);

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    console.error("Error in getDestination:", err);
    next(err);
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Public
exports.createDestination = async (req, res, next) => {
  try {
    // Remove _id from the request body if it exists
    const { _id, ...destinationData } = req.body;

    console.log("🌈 [Destination Creation Started]", {
      timestamp: new Date().toISOString(),
      userId: destinationData.userId,
      title: destinationData.title,
      country: destinationData.country,
    });

    // Let MongoDB generate the _id automatically
    const destination = await Destination.create(destinationData);

    console.log("🚀 [Destination Created Successfully]", {
      id: destination._id,
      title: destination.title,
      status: destination.status,
    });

    res.status(201).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    console.error("🔥 [Destination Creation Failed]", {
      error: err.message,
      stack: err.stack,
      body: req.body,
    });
    next(err);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Public
exports.updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Public
exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/destinations/:id/featured
// @access  Public
exports.toggleFeatured = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: "Destination not found",
      });
    }

    destination.featured = !destination.featured;
    await destination.save();

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user statistics
// @route   GET /api/destinations/user/:userId/stats
// @access  Public
exports.getUserStats = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ userId: req.params.userId });
    const visited = destinations.filter((d) => d.status === "visited").length;
    const countries = [...new Set(destinations.map((d) => d.country))].length;

    res.status(200).json({
      success: true,
      data: {
        total: destinations.length,
        visited,
        toVisit: destinations.length - visited,
        countries,
        progress:
          destinations.length > 0
            ? Math.round((visited / destinations.length) * 100)
            : 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
