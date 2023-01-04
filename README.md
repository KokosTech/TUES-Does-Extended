# TUES-Does
TUES - to-do app

## използвани технологии 

frontend: 
- React.JS
- TailwindCSS

api:
- nodeJS
- expressJS

db: 
- PostgreSQL

## как се използва 

### предварителни изисквания

- nodejs
- yarn || npm (npm идва заедно с nodejs) - ВНИМАНИЕ - някои команди в този tutorial трябва да ги промените на npm
- PostgreSQL

### изтегляне на проекта

```bash
git clone https://github.com/KokosTech/TUES-Does
cd TUES-Does
```

### стартиране на проекта
*нужни са Ви 3 отворени терминала в TUES-Does директорията*

Terminal 1:

```sql
psql -U ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL

CREATE DATABASE tues_does;
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

GRANT USAGE ON SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT ALL PRIVILEGES ON DATABASE database_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;
```

Terminal 2:

```bash
cd api
nano .env
```

и попълнете файла по следния начин:

```
DB_USER=ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL
DB_HOST=localhost
DB_PASSWORD=ПАРОЛАТА_НА_ПОТРЕБИТЕЛЯ_В_PSQL
DB_NAME=tues_does
DB_PORT=5432
COOKIE_SECRET=tues_does
```

и излезте с ```CTRL+O ENTER```

```bash
yarn
node index.js
```

Terminal 3:

```bash
cd frontend
nano .env
```

и попълнете файла по следния начин:

```
REACT_APP_SERVER_URL=http://localhost:5002
```

и излезте с ```CTRL+O ENTER```

```bash
yarn
yarn start
```

след това браузърът Ви ще се отвори автоматично на страницата и всичко би трябвало да работи

## Демо

### NEW VER

https://user-images.githubusercontent.com/46886807/177044531-6c1798ef-37ca-4a6e-9698-6ed6336eb1fa.mov

https://user-images.githubusercontent.com/46886807/177044626-ddadda7a-b74f-46f8-8544-85af81280660.mov

### OLD VER

https://user-images.githubusercontent.com/46886807/176786984-b9a41027-e576-45ce-9794-19d7a8740475.mov
