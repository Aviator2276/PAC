require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// Add helmet 

/* TODO
Get Google TTS API
Get Team Sponsor Images
Get Twitch Stream API
Get Spotify API
*/
//const authenticate = require('./middleware/auth')

//const authRouter = require('./routes/auth');
const scheduleAPI = require('./routes/schedule');
const rankAPI = require('./routes/rank');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'));
app.use(express.json());

//app.use('/api/v1/auth', authRouter);
app.use('/api/v1/schedule', scheduleAPI);
app.use('/api/v1/rank', rankAPI);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();