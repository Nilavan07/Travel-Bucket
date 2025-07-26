const express = require("express");
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  toggleFeatured,
  getUserStats,
} = require("../controllers/destinationsController");

const router = express.Router();

// Get user stats (more specific route first)
router.route("/user/:userId/stats").get(getUserStats);

// Toggle featured destination (specific before :id)
router.route("/:id/featured").patch(toggleFeatured);

// Standard CRUD
router.route("/").get(getDestinations).post(createDestination);
router
  .route("/:id")
  .get(getDestination)
  .put(updateDestination)
  .delete(deleteDestination);

module.exports = router;
