const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8888;
//USER DB ->
// always encrypt passwords in production
const users = [
  {id: 1, username: "admin", password: "admin"},
  {id: 2, username: "guest", password: "guest"},
];

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  //check if request formatted correctly
  if(!req.body.username || !req.body.password) {
    res
    .status(400)
    .send("You need a username and password");
    return;
  }
  // check if we have a username that matches
  const user = users.find((u) => {
    return u.username === req.body.username && u.password === req.body.password;
  });
  if(!user) {
    res
    .status(401)
    .send('User not found');
    return;
  }
  // use sign method to create sign token
  const token = jwt.sign({
    sub: user.id,
    username: user.username
  }, "mysupersecretkey", {expiresIn: "3 hours"});

  res
  .status(200)
  .send({access_token: token});
});

app.get('/status', (req, res) => {
  const localTime = (new Date()).toLocaleTimeString();

  res.status(200)
  .send(`Server time is ${localTime}.`);
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});