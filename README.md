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

db Builder:

- Python

## как се използва

### предварителни изисквания

- nodejs
- yarn || npm (npm идва заедно с nodejs) - ВНИМАНИЕ - някои команди в този tutorial трябва да ги промените на npm
- PostgreSQL
- Python 3.8+

### изтегляне на проекта

```bash
git clone https://github.com/KokosTech/TUES-Does
cd TUES-Does
```

### стартиране на проекта

_нужни са Ви 3 отворени терминала в TUES-Does директорията_

Терминал 1:

Направете .env (в `db/`) файл, който съдържа следните променливи:

```
DB_USER=<ИМЕ НА ПОТРЕБИТЕЛЯ В PSQL>
DB_HOST=localhost
DB_PASS=<ПАРОЛА>
DB_NAME=postgres
NEW_DB_NAME=<ИМЕ НА НОВАТА БАЗА ДАННИ>
DB_PORT=5432
```

И след това изпълнете следните команди:

```bash
cd db
pip install -r requirements.txt
python3 createDB.py
```

Ако имате проблеми с операциите с базата данни по време на run-ването приложението, можете да ги решите със следните команди в psql терминала:

```sql
GRANT USAGE ON SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA schema_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;

GRANT ALL PRIVILEGES ON DATABASE database_name TO ИМЕТО_НА_ПОТРЕБИТЕЛЯ_В_PSQL;
```

#### Терминал 2:

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

и излезте с `CTRL+O ENTER`

```bash
yarn
node index.js
```

#### Терминал 3:

```bash
cd frontend
nano .env
```

и попълнете файла по следния начин:

```
REACT_APP_SERVER_URL=http://localhost:5002
```

и излезте с `CTRL+O ENTER`

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
