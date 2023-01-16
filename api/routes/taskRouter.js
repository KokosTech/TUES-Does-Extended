const checkAuth = require("../middleware/checkAuth");

const router = require("express").Router();
const pool = require("../db");

router
  .route("/:id")
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
          task.flagged ? "true" : "false",
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

router.get("/:id/completed", checkAuth, (req, res) => {
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

router.get("/:id/uncompleted", (req, res) => {
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
