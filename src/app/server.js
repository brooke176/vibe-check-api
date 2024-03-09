require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const { auth } = require('express-oauth2-jwt-bearer');
const User = require('./UserModel');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to MongoDB!"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket Server
const wss = new WebSocket.Server({ server });

// Auth0 JWT Check
// const jwtCheck = auth({
//   audience: 'https://dev-e86qxmlpu8jkgpw3.us.auth0.com/api/intent/goOut',
//   // audience: 'https://vcapi.com/api/intent/goOut',
//   issuerBaseURL: 'https://dev-e86qxmlpu8jkgpw3.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

// enforce on all endpoints
// app.use(jwtCheck);

// app.get('/authorized', function (req, res) {
//     res.send('Secured Resource');
// });

// Middleware
// app.use(bodyParser.json());
// const jwtCheck = auth({
//   audience: 'https://vcapi.com/api/intent/goOut',
//   issuerBaseURL: 'https://dev-e86qxmlpu8jkgpw3.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });
// app.use(jwtCheck);

app.use(bodyParser.json());
app.use('/api/intent/goOut', friendRoutes);

// WebSocket connections handling
const clients = {};
wss.on('connection', (ws, req) => {
  const userId = req.url.split('?userId=')[1];
  if (userId) {
    clients[userId] = ws;
  }
  ws.on('close', () => {
    delete clients[userId];
  });
});

function notifyUser(userId) {
  if (clients[userId]) {
    clients[userId].send(JSON.stringify({ message: 'Mutual intent found!' }));
  }
}

app.post('/api/intent/goOut', async (req, res) => {
  const { userId, wantsToGoOut, selectedFriends } = req.body;
  console.log("body console", {userId, wantsToGoOut, selectedFriends});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, goOutIntents: [] });
    }

    const intentIndex = user.goOutIntents.findIndex(intent => intent.date.toISOString() === today.toISOString());
    if (intentIndex > -1) {
      user.goOutIntents[intentIndex] = { date: today, wantsToGoOut, friends: selectedFriends };
    } else {
      user.goOutIntents.push({ date: today, wantsToGoOut, friends: selectedFriends });
    }
    await user.save();

// After saving the user's intent
selectedFriends.forEach(async (friendId) => {
  const friend = await User.findOne({ userId: friendId });
  if (friend && friend.goOutIntents.some((intent) => intent.friends.includes(userId) && intent.wantsToGoOut)) {
    notifyUser(userId);
    notifyUser(friendId);
  }
});

    res.json({ message: "Go out intent processed. Checking for mutual intentions." });
  } catch (error) {
    console.error("Error processing go out intent:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
