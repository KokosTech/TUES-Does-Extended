const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const pool = require("../db");

router.route("/:lid")
.get(checkAuth, async (req, res) => {
  const { lid } = req.params;
  //const { uid } = req.session.user;

  // tasks done / total tasks
  // transaction - it's worthless, buuuut it's a good practice

  const client = await pool.connect();
  try {
    console.warn("BEGIN");
    await client.query("BEGIN");
    const total = await client.query(
      `SELECT COUNT(*) FROM tasks WHERE list_id = $1`,
      [lid]
    );
    const done = await client.query(
      `SELECT COUNT(*) FROM tasks WHERE list_id = $1 AND completed = true`,
      [lid]
    );
    await client.query("COMMIT");

    const progress = {
        total: total.rows[0].count,
        done: done.rows[0].count
    }

    //res.json(progress);

  } catch (err) {
    await client.query("ROLLBACK");
    //res.status(500).json({ error: err.message });
    console.log("ROLLBACK", err.message);
  } finally {
    client.release();
  }
});

module.exports = router;
