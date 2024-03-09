// const express = require('express');
// const mongoose = require('mongoose');
// const { auth } = require('express-oauth2-jwt-bearer');
// const bodyParser = require('body-parser');

// const app = express();
// const port = process.env.PORT || 8080;

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/vibeCheckDB', { useNewUrlParser: true, useUnifiedTopology: true });

// // Middleware
// app.use(bodyParser.json());
// const jwtCheck = auth({
//   audience: 'https://vcapi.com/api/intent/goOut',
//   issuerBaseURL: 'https://dev-e86qxmlpu8jkgpw3.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });
// app.use(jwtCheck);
