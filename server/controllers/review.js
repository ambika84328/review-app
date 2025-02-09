const Review = require('../models/review'); // Renamed model

// POST - Add a new review
exports.postAddReview = async (req, res, next) => {
  console.log(req.body);
  try {
    const { company, pros, cons, rating } = req.body;

    // Check if a review for the company already exists
    let existingReview = await Review.findOne({ where: { company: company } });

    if (existingReview) {
      // Append pros and cons to existing ones
      existingReview.pros += `; ${pros}`;
      existingReview.cons += `; ${cons}`;
      
      // Update rating by averaging the new rating with the old rating
      existingReview.rating = (existingReview.rating + rating) / 2;

      await existingReview.save();
      console.log('Updated Review');
      res.status(200).json({ message: 'Review updated successfully', review: existingReview });

    } else {
      // Create a new review
      const newReview = await Review.create({
        company,
        pros,
        cons,
        rating
      });

      console.log('Created New Review');
      res.status(201).json({ message: 'Review created successfully', review: newReview });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating/updating review', error: err.message });
  }
};


// GET - Fetch all reviews
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json({ reviews: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews', error: err.message }); // 500 Internal Server Error
  }
};
