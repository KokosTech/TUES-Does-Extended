const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const pool = require("../db");

const router = express.Router();

// TODO: fix checkAuth
// TODO: add error handling
// TODO: check if user has access to list / task

router
  .route("/lists/:user")
  .get(checkAuth, (req, res) => {
    const user = req.params.user;
    if (!user) {
      res.status(400).json({ message: "No user specified" });
      return;
    }
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
        ORDER BY lists.id ASC;`,
        [user]
      )
      .then((lists) => {
        res.json(lists.rows);
      })
      .catch((err) => {
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
  .route("/lists/:id")
  .get((req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    pool
      .query(
        `SELECT
            lists.id, 
            lists.name,
            user.username,
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
        res.status(500).json({ error: err.message });
      });
  })
  .post((req, res) => {
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
router
  .route("/tasks/:id")
  .get((req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    pool
      .query(
        `SELECT
            tasks.id, 
            tasks.list_id,
            lists.name,
            tasks.name,
            tasks.description,
            tasks.priority,
            tasks.due_date,
            tasks.flagged,
            tasks.completed
        FROM tasks
            JOIN lists ON tasks.list_id = lists.id
        WHERE lists.id = $1
        ORDER BY tasks.completed DESC, tasks.id DESC`,
        [id]
      )
      .then((task) => {
        res.json(task.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })
  .post(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    const task = req.body;
    console.log(task);
    if (!task) {
      res.status(400).json({ message: "No task specified" });
      return;
    }

    pool
      .query(
        `INSERT INTO 
            tasks (
                name, 
                list_id,
                description,
                priority,
                due_date,
                flagged,
                completed
            ) 
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
        returning id;`,
        [
          task.name,
          task.list_id,
          task.description,
          task.priority,
          task.due_date.toLowerCase() === "null" || task.due_date === ""
            ? null
            : task.due_date,
          false,
          task.completed,
        ]
      )
      .then((data) => {
        console.log("IDDDD:::: ", data.rows[0].id);
        res.json({ message: "Task created", id: data.rows[0].id });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  })
  .put(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    const task = req.body;
    if (!task) {
      res.status(400).json({ message: "No task specified" });
      return;
    }

    pool
      .query(
        `
        UPDATE 
            tasks 
        SET 
            name = $1,
            description = $2,
            priority = $3,
            due_date = $4,
            flagged = $5,
            completed = $6
        WHERE 
            id = $7`,
        [
          task.name,
          task.description,
          task.priority,
          task.due_date?.toLowerCase() === "null" || task.due_date === ""
            ? null
            : task.due_date,
          task.flagged,
          task.completed,
          task.id,
        ]
      )
      .then(() => {
        res.json({ message: "Task updated" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  })
  .delete(checkAuth, (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No id specified" });
      return;
    }

    const task = req.body;
    if (!task) {
      res.status(400).json({ message: "No task specified" });
      return;
    }
    pool
      .query(`DELETE FROM tasks WHERE id = $1;`, [id])
      .then(() => {
        console.log("DELETED");
        res.json({ message: "Task deleted" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

router.get("/tasks/:id/completed", checkAuth, (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "No id specified" });
    return;
  }

  pool
    .query(
      `SELECT
          tasks.id,
          tasks.list_id,
          lists.name,
          tasks.name,
          tasks.description,
          tasks.priority,
          tasks.due_date,
          tasks.flagged,
          tasks.completed
      FROM tasks
          JOIN lists ON tasks.list_id = lists.id
      WHERE lists.id = $1
      AND tasks.completed = true
      ORDER BY
          tasks.completed, tasks.id DESC`,
      [id]
    )
    .then((task) => {
      res.json(task.rows);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/tasks/:id/uncompleted", (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: "No id specified" });
    return;
  }

  pool
    .query(
      `SELECT
            tasks.id,
            tasks.list_id,
            lists.name,
            tasks.name,
            tasks.description,
            tasks.priority,
            tasks.due_date,
            tasks.flagged,
            tasks.completed
        FROM tasks
            JOIN lists ON tasks.list_id = lists.id
        WHERE lists.id = $1 
        AND tasks.completed = false
        ORDER BY
            tasks.completed, tasks.id DESC`,
      [id]
    )
    .then((task) => {
      res.json(task.rows);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
