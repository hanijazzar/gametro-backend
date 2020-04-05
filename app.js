const express = require('express');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
// const redis = require('redis');
// const expressRedis = require('express-redis');




const app = express();

const PORT = process.env.PORT || 5000;
// const REDIS_PORT = process.env.PORT || 6379;

// const redisClient = redis.createClient(REDIS_PORT);

// connect Database
connectDB();

// Init Middleware
app.use(express.json({extended: false}));

// Redis middleware
// app.use(expressRedis());

// For file upload
app.use(fileUpload());

// Serve Static Assets
app.use(express.static('public'));

// enable CORS in development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.get('/', (req, res) => res.send('API Running'));

// Define Routes 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/games', require('./routes/api/games'));
app.use('/api/contacts', require('./routes/api/contacts'));
app.use('/api/subscribers', require('./routes/api/subscribers'));
app.use('/api/commons', require('./routes/api/commons'));






app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 