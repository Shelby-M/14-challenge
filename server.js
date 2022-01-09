const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require(`express-session`);
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers })

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);


const app = express();
const PORT = process.env.PORT || 3001;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const sess = {
    secret: "This is a major secret!",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
};

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("./controllers"));
app.use(session(sess));

sequelize.sync({force: false}).then(() => {
app.listen(PORT, () => console.log("App listening on PORT " + PORT))
});
