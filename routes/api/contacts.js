const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Contact = require('../../models/Contact');



// @route    GET api/contacts
// @desc     Get all contact us submissions
// @access   Public
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    POST api/contacts
// @desc     Create a contact
// @access   Public
router.post(
  '/',
  [
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
        check('email', 'Email is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      let contact = new Contact();

      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.subject = req.body.subject;
      contact.message = req.body.message;

      const savedContact = await contact.save();

      res.json(savedContact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
