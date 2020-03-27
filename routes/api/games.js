const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const request = require('request');
const paginate = require('jw-paginate');


const Game = require('../../models/Game');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route    GET api/games
// @desc     Get all games
// @access   Public
router.get('/', async (req, res) => {
  try {
    // ?page=2&itemsPerPage=2
    const page = parseInt(req.query.page) || 1; // default page
    let itemsPerPage = parseInt(req.query.itemsPerPage) || 3; // default number of items

    // let {page, itemsPerPage} = req.query; can also do that

    if (itemsPerPage > 4) itemsPerPage = 4;
    console.log('page', page);
    console.log('itemsPerPage', itemsPerPage);

    // get page from query params or default to first page
    // const page = parseInt(req.query.page) || 1;

    const gamesCount = await Game.countDocuments();
    console.log('gamesCount', gamesCount);

    // get pager object for specified page
    const pager = paginate(gamesCount, page, itemsPerPage);

    // get page of items from items array
    // const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);



    // const games = await Game.find().sort({ date: -1 });
    // const games = await Game.find({name:regex}); // for searching
    

    const pageOfGames = await Game.find().sort({ date: -1 })
      .skip((itemsPerPage * page) - itemsPerPage)
      .limit(itemsPerPage);

    // console.log(req.headers.host);
    const host = req.protocol + '://' + req.headers.host;
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log(fullUrl);

    // games.forEach( game => game.image = `${host}/uploads/${game.image}`);
    let gamesFixed = pageOfGames.map( game => {
      game.image = `${host}/uploads/${game.image}`;
      return game;
    });
    // map better for changing values then foreach


  
// return pager object and current page of items
return res.json({ pager, data: gamesFixed });

    res.json(gamesFixed);





   












  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/games/:id
// @desc     Get game by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    console.log('called');

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }
    const host = req.protocol + '://' + req.headers.host;

    game.image = `${host}/uploads/${game.image}`;

    res.json(game);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Game not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    POST api/games
// @desc     Create a game
// @access   Private
router.post(
  '/',
  [
    // auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // const user = await User.findById(req.user.id).select('-password');

      let game = new Game();

      if (req.body.id) {
        game = await Game.findById(req.body.id);
        // const game = await Game.findOne({'_id': req.body.id});

        if (!game) {
          return res.status(404).json({ msg: 'Game not found' });
        }

        console.log('Edit');
        // console.log(game);
      } else {
        // const game = new Game({});
        game.currency = '$';
        game.stars = 4;
        game.reviews = 10;
        game.image = 'assets/img/games/halo5.jpg';
        // game.description = 'Nice game';
        game.category = 'Snow';
        // console.log('Add');
        // console.log(game);
      }

      game.name = req.body.name;
      game.country = req.body.country;
      game.price = req.body.price;
      game.description = req.body.description;
      game.available_from = req.body.available_from;

      if (req.files === null) { 
        // return res.status(400).json({ msg: 'No file uploaded' });

        const savedGame = await game.save();
        res.json(savedGame);

      } else {
        // if a file is uploaded

        const file = req.files.image;
        const filePath = `games/${file.name}`;
        // console.log(`${__dirname}`);


        file.mv(`${__dirname}/../../public/uploads/${filePath}`, async err => {
          // console.log('in file');

          if (err) {
            console.error(err);
            // console.error('error moving'); 

            // return res.status(500).send(err);
          } else {
            // console.log('moved');
            // console.log(filePath);

            game.image = filePath;
          }

          const savedGame = await game.save();
          res.json(savedGame);

          // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
        });
      }

      // console.log('after file');


      // const savedGame = await game.save();
      // res.json(savedGame);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/games/:id
// @desc     Delete a game
// @access   Private
router.delete(
  '/:id',
  // auth,
  async (req, res) => {
    try {
      console.log('delete game called');
      const game = await Game.findById(req.params.id);
      console.log(game);

      if (!game) {
        return res.status(404).json({ msg: 'Game not found' });
      }

      // Check user
      // if (game.user.toString() !== req.user.id) {
      //   return res.status(401).json({ msg: 'User not authorized' });
      // }

      await game.remove();

      res.json({ msg: 'Game removed' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Game not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);







module.exports = router;
