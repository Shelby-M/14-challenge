const router = require("express").Router();
const { Comment, Post, User } = require("../models");

router.get("/", (req, res) => {
  Post.findAll({
    include: [{ model: User }],
  })
    .then((dbPostData) => {
      res.render("homepage", { dbPostData });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Post.findone
//login, signup
module.exports = router;
