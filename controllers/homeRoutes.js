const router = require("express").Router();
const { ExpressHandlebars } = require("express-handlebars");
const session = require("express-session");
const {  User } = require("../models/User");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
     const sessionId = req.session.id;

    console.log("session email: " + req.session.email);

    // Pass serialized data and session flag into template
    res.render("homepage", {
      sessionId,
      sessionEmail: req.session.email,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/profile/:sessionId", withAuth, async (req, res) => {
  console.log(req.session.email);

  const userData = await User.findOne(
    { where: { email: req.session.email } },
    { attributes: { exclude: ["password"] }}
  );
  const sessionId = req.session.id;
  const user = userData.get({ plain: true });
  console.log(user);

  res.render("profile", {
    ...user,
    sessionId,
    loggedIn: true,
  });
});

// Get signup template
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signUp");
});

// Get login template
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signIn");
});
module.exports = router