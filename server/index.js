require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const ctrl = require("./controllers/controller");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

app.use(express.json());

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log("db connected");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.get('/auth/logout', ctrl.logout);
app.post("/auth/register", ctrl.register);
app.post('/auth/login', ctrl.login);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`I want to eat ${PORT} tacos.`));
