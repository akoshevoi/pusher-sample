const Pusher = require("pusher");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pusher = new Pusher({
  appId: "1237736",
  key: "d1b131a24f37362ce861",
  secret: "6d2237c4719b0ab8b6d8",
  cluster: "eu",
  useTLS: true,
});

app.set("PORT", process.env.PORT || 5000);

app.post("/message", (req, res) => {
  const payload = req.body;
  pusher.trigger(req.body.channel, "message", payload);
  res.send(payload);
});

app.listen(app.get("PORT"), () =>
  console.log(`Listening at ${app.get("PORT")}`)
);
