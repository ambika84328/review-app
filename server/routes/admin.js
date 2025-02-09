const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review'); // Updated controller name

router.get('/', reviewController.getReviews);
router.post('/', reviewController.postAddReview);

module.exports = router;
