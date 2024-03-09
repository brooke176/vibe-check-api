const axios = require('axios');

const data = {
  userId: 'google-oauth2|102864193171999781468',
  wantsToGoOut: true,
  selectedFriends: ['auth0|65e7e171c0afa4cac6137ecb']
};

axios.post('/api/intent/goOut', data, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your_access_token>'
  }
})
.then((response) => {
  console.log('Response:', response.data);
})
.catch((error) => {
  console.error('Error:', error.response.data);
});
