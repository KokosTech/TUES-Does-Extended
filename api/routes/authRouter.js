const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");

const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later",
});

const signupLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 5 login attempts per windowMs
  message: "Too many signup attempts, please try again later",
});

// login

router
  .route("/login")
  .all(loginLimiter)
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(validateForm, async (req, res) => {
    const potentialLogin = await pool.query(
      `SELECT 
                id, 
                username, 
                passhash 
            FROM 
                users u 
            WHERE 
                u.username = $1`,
      [req.body.username]
    );

    if (potentialLogin.rows.length === 0) {
      res.json({ message: "Invalid username or password" });
    } else {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );

      if (isSamePass) {
        //const token = jwt.sign({ id: potentialLogin.rows[0].id }, process.env.JWT_SECRET); - for jwt - in the future

        req.session.user = {
          id: potentialLogin.rows[0].id,
          username: req.body.username,
          //token: token
        };
        res.json({ loggedIn: true, username: req.body.username });
      } else {
        res.json({ loggedIn: false, message: "Invalid credentials" });
      }
    }
  });

// sign up

router.all(loginLimiter).post("/signup", validateForm, async (req, res) => {
  console.log(req.body.username);

  const existingUser = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, passhash, salt) VALUES ($1, $2, $3) RETURNING *",
      [req.body.username, hashedPassword, salt]
    );
    const token = jwt.sign({ id: newUser.rows[0].id }, "supersecret", {
      expiresIn: "1h",
    });

    req.session.user = {
      id: newUser.rows[0].id,
      username: newUser.rows[0].username,
      token: token,
    };
    res.json({ loggedIn: true, username: req.body.username, token: token });
  } else {
    res.json({ loggedIn: false, message: "Username is already taken" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ loggedIn: false });
});

module.exports = router;
