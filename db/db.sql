/* POSGRESS SQL DATABASE */

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(28) NOT NULL UNIQUE,
  passhash VARCHAR NOT NULL,
  salt VARCHAR NOT NULL
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(28) NOT NULL,
  icon VARCHAR(18),
  color VARCHAR(6)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  name VARCHAR(28) NOT NULL,
  description VARCHAR(255),
  priority INTEGER NOT NULL,
  due_date DATE,
  flagged BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false
);

/* Inset */

INSERT INTO users (username, passhash, salt) VALUES ($1, $2, $3);
INSERT INTO lists (owner_id, name, icon, color) VALUES ($1, $2, $3, $4);
INSERT INTO tasks (list_id, name, description, priority, due_date, flagged, completed) VALUES ($1, $2, $3, $4, $5, $6, $7);

INSERT INTO users (username, passhash, salt) VALUES ('abc', '$2a$10$Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q', '$2a$10$Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q.Z.Q');
INSERT INTO lists (owner_id, name, icon, color) VALUES (1, 'To Do', 'fa-list', 'f5f5f5');

/* Get users */

SELECT 
  username 
FROM 
  users
ORDER BY 
  username;

/* Get lists from username */

/* For express */


SELECT 
  lists.id,
  lists.name,
  lists.icon,
  lists.color
FROM users
  JOIN lists ON users.id = lists.owner_id
WHERE users.username = $1
ORDER BY lists.name; 


/* Test */

SELECT 
  lists.id,
  lists.name,
  lists.icon,
  lists.color
FROM users
  JOIN lists ON users.id = lists.owner_id
WHERE users.username = 'admin'
ORDER BY lists.name;

/* Get tasks from list */

/* Express */

SELECT
  tasks.id,
  tasks.name,
  tasks.description,
  tasks.priority,
  tasks.due_date,
  tasks.flagged,
  tasks.completed
FROM tasks
  JOIN lists ON tasks.list_id = lists.id
WHERE lists.id = $1
ORDER BY tasks.id;

/* test */

SELECT
  tasks.id,
  tasks.name,
  tasks.description,
  tasks.priority,
  tasks.due_date,
  tasks.flagged,
  tasks.completed
FROM tasks
  JOIN lists ON tasks.list_id = lists.id
WHERE lists.id = 1
ORDER BY tasks.id;


/* Update */

/* Users */

UPDATE
  users
SET
  username = $1
WHERE
  id = $2;

/* Lists */

UPDATE
  lists
SET
  name = $1,
  icon = $2,
  color = $3
WHERE
  id = $4;

/* Tasks */

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
  id = $7;
