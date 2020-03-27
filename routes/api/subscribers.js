const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Subscriber = require('../../models/Subscriber');



// @route    GET api/subscribers
// @desc     Get all subscribers
// @access   Public
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ date: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    POST api/subscribers
// @desc     Create a subscriber
// @access   Public
router.post(
  '/',
  [
    [
        check('email', 'Email is required')
        .not()
        .isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      let subscriber = new Subscriber();

      subscriber.email = req.body.email;

      const savedSubscriber = await subscriber.save();

      res.json(savedSubscriber);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
