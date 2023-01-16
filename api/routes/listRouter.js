const checkAuth = require("../middleware/checkAuth");

const express = require("express");

const router = express.Router();

const pool = require("../db");

router
  .route("/user/:user")
  .get(checkAuth, (req, res) => {
    const user = req.params.user;
    if (!user) {
      console.log("No user specified");
      res.status(400).json({ message: "No user specified" });
      return;
    }

/*     if(user !== req.session.user.username) {
        console.log("Unauthorized -> ", user, req.session.user.username);
        res.status(401).json({ message: "Unauthorized" });
        return;
    } */

    pool
      .query(
        `SELECT 
            lists.id,
            lists.name,
            lists.icon,
            lists.color
        FROM users
        JOIN lists 
            ON users.id = lists.owner_id
        WHERE users.username = $1
        ORDER BY lists.id ASC`,
        [user]
      )
      .then((lists) => {
        console.log("[/lists/user/:user ("+ user +")", lists.rows);
        res.json(lists.rows);
      })
      .catch((err) => {
        console.error("[/lists/user/:user ("+ user +")", err.message);
        res.status(500).json({ error: err.message });
      });
  })
  .post(checkAuth, async (req, res) => {
    const user = req.params.user;
    if (!user) {
      res.status(400).json({ message: "No user specified" });
      return;
    }

    const list = req.body;
    if (!list) {
      res.status(400).json({ message: "No list specified" });
      return;
    }

    // use it with nested queries OR use transaction - implement on friday
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const userId = await client.query(
        `SELECT id FROM users WHERE username = $1`,
        [user]
      );

      const listId = await client.query(
        `INSERT INTO lists
            (name, icon, color, owner_id)
        VALUES
            ($1, $2, $3, $4)
        returning id;`,
        [
          list.name,
          list.icon || "default",
          list.color || "blue",
          userId.rows[0].id,
        ]
      );
      await client.query("COMMIT");

      res.json({ message: "List created", id: listId.rows[0].id });
    } catch (err) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }

    /*     pool
      .query(
        `INSERT INTO lists 
            (name, icon, color, owner_id) 
        VALUES 
            ($1, $2, $3, (SELECT id FROM users WHERE username = $4))
        returning id;`,
        [list.name, list.icon || "default", list.color || "blue", user]
      )
      .then((data) => {
        res.json({ message: "List created", id: data.rows[0].id });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      }); */
  })
  .put(checkAuth, (req, res) => {
    const user = req.params.user;
    if (!user) {
      res.status(400).json({ message: "No user specified" });
      return;
    }

    const list = req.body;
    if (!list) {
      res.status(400).json({ message: "No list specified" });
      return;
    }

    pool
      .query(
        `UPDATE 
            lists 
        SET 
            name = $1, icon = $2, color = $3 
        WHERE id = $4;`,
        [list.name, list.icon, list.color, list.id]
      )
      .then(() => {
        res.json({ message: "List updated" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })
  .delete(checkAuth, (req, res) => {
    const user = req.params.user;
    if (!user) {
      res.status(400).json({ message: "No user specified" });
      return;
    }

    const list = req.body;
    if (!list) {
      res.status(400).json({ message: "No list specified" });
      return;
    }

    pool
      .query(`DELETE FROM lists WHERE id = $1`, [list.id])
      .then(() => {
        res.status(200).json({ message: "List deleted" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
router
  .route("/:id")
  .get(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      console.error("\nNo id specified\n");
      res.status(400).json({ message: "No id specified" });
      return;
    }

    //check if id is number in string
    if (isNaN(id)) {
      console.error("\nId is not a number -> ", id, "\n");
      res.status(400).json({ message: "Id is not a number" });
      return;
    }

    pool
      .query(
        `SELECT
            lists.id, 
            lists.name,
            users.username,
            lists.icon,
            lists.color,
        FROM lists
        JOIN users 
            ON lists.owner_id = users.id
        WHERE user.id = $1
        ORDER BY lists.id ASC;`,
        [id]
      )
      .then((list) => {
        res.json(list.rows);
      })
      .catch((err) => {
        console.error("\n\nERROR:", err.message);
        res.status(500).json({ error: err.message });
      });
  })
  .post(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    const item = req.body;
    if (!item) {
      res.status(400).json({ message: "No item specified" });
      return;
    }

    pool
      .query(
        `INSERT INTO items 
            (name, list_id) 
        VALUES 
            ($1, $2)
        returning id;`,
        [item.name, id]
      )
      .then((data) => {
        res.json({ message: "Item created", id: data.rows[0].id });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })
  .put(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    const item = req.body;
    if (!item) {
      res.status(400).json({ message: "No item specified" });
      return;
    }

    pool
      .query(`UPDATE items SET name = $1 WHERE id = $2;`, [item.name, item.id])
      .then(() => {
        res.json({ message: "Item updated" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })
  .delete(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    const item = req.body;
    if (!item) {
      res.status(400).json({ message: "No item specified" });
      return;
    }

    pool
      .query(`DELETE FROM items WHERE id = $1`, [item.id])
      .then(() => {
        res.json({ message: "Item deleted" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

module.exports = router;
