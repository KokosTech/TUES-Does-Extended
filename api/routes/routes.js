const express = require("express");

const router = express.Router();

// TODO: fix checkAuth
// TODO: add error handling
// TODO: check if user has access to list / task

// get from router files
router.use('/auth', require('./authRouter'));
router.use("/lists", require("./listRouter"));
router.use("/tasks", require("./taskRouter"));
router.use("/stats", require("./statsRouter"));

module.exports = router;
