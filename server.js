const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require(`express-session`);

const app = express();
const PORT = process.env.PORT || 3001;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "This is a major secret!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
