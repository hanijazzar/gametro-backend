const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const request = require('request');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

// @route    GET api/commons
// @desc     Get empty array
// @access   Public
router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/commons/external-games
// @desc     GET games from moackapi
// @access   Public
router.get('/external-games', async (req, res) => {
  try {
    let externalGames;

    // implement caching using redis.
    // cache the date after the first call and then if the data exists in cache, retrieve it from cache instead of making an api request

    req.db.get('dests', function(err, data) {
      if (err) {
        return res.status(500).end();
      }
      if (data !== null) {
        console.log('Returning data from cache');
        const cachedData = JSON.parse(data);
        let externalGamesUpdated = cachedData.map(
          externalGame => {
            externalGame._id = externalGame.id;
            return externalGame;
          }
        );
        res.json(externalGamesUpdated);
      } else {
        /////// external api
        const options = {
          uri: encodeURI(
            `https://5e75ede375012c00165e4754.mockapi.io/api/games`
          ),
          method: 'GET',
          headers: {
            'user-agent': 'node.js'
          }
        };

        request(options, (error, response, body) => {
          if (error) console.error(error);

          if (!response) return res.json({msg: 'Could not get response'});

          if (response.statusCode !== 200) {
            return res.status(404).json({ msg: 'No games found' });
          }

          externalGames = JSON.parse(body);
          req.db.setex('dests', 10, JSON.stringify(externalGames));
          // map better for changing values then foreach

          // externalGames.forEach(
          //   externalGame =>
          //     (externalGame._id = externalGame.id)
          // );

          let externalGamesUpdated = externalGames.map(
            externalGame => {
              externalGame._id = externalGame.id;
              return externalGame;
            }
          );

          console.log('Making api call and returning data from external api');

          res.json(externalGamesUpdated);

          // console.log(externalGames);
          // let allGames = [...games, ...externalGames];
          // res.json(allGames);
        });
        // end external api
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    GET api/commons/try-logging
// @desc     Try logging and helpers utils
// @access   Public
router.get('/try-logging', async (req, res) => {
  try {
    helpers.helper1();
    logger.log('info', 'pagenumber1', {msg: 'don2e'});

    res.json({msg: 'done2'});

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

module.exports = router;
