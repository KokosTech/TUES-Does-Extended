const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const pool = require("../db");

router.route("progress/:lid")
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

router.route("/total/:lid")
.get(checkAuth, async (req, res) => {
  const { lid } = req.params;
  //const { uid } = req.session.user;

  pool.query(
    `SELECT COUNT(*) FROM tasks WHERE list_id = $1`,
  )
  .then((total) => {
    console.log("[/stats/total/:lid ("+ lid +")", total.rows);
    res.json(total.rows);
  })
  .catch((err) => {
    console.error("[/stats/total/:lid ("+ lid +")", err.message);
    res.status(500).json({ error: err.message });
  });
});


module.exports = router;
