import os
from dotenv import load_dotenv

import psycopg2
from psycopg2 import errors

load_dotenv()
new_db_name = os.getenv('NEW_DB_NAME')


def connect(db_name=None):
    load_dotenv()
    print(db_name)
    print(f"Connecting to database... {db_name or os.getenv('DB_NAME')}")
    conn = psycopg2.connect(
        database=db_name or os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    conn.autocommit = True
    cursor = conn.cursor()
    return conn, cursor


def create_database():
    conn, cursor = connect(new_db_name)
    print("Creating database...")
    try:
        cursor.execute("CREATE DATABASE " + os.getenv('NEW_DB_NAME'))
        print("Database has been created successfully !!")
    except errors.DuplicateDatabase:
        print("Database already exists.")
        print("Do you still want to create tables? (y/n)")
        if input() == "y":
            print("Creating tables...")
        else:
            print("Exiting...")
            conn.close()
            exit()
    conn.close()


def create_tables():
    conn, cursor = connect(db_name=new_db_name)
    users = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(28) NOT NULL UNIQUE,
        passhash VARCHAR NOT NULL,
        salt VARCHAR NOT NULL
    );
    """

    lists = """
    CREATE TABLE IF NOT EXISTS lists (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(28) NOT NULL,
        icon VARCHAR(18),
        color VARCHAR(6)
    );
    """

    tasks = """
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
        name VARCHAR(28) NOT NULL,
        description VARCHAR(255),
        priority INTEGER NOT NULL,
        due_date DATE,
        flagged BOOLEAN NOT NULL DEFAULT false,
        completed BOOLEAN NOT NULL DEFAULT false
    );
    """

    conn.autocommit = False

    try:
        cursor.execute(users)
        cursor.execute(lists)
        cursor.execute(tasks)

        # commit the changes
        conn.commit()
    except Exception as e:
        print("Failed to create tables.")
        print(e)
        conn.close()
        return False
    else:
        print("Tables created successfully.")
        conn.autocommit = True
        conn.close()
        return True


if __name__ == "__main__":
    create_database()
    create_tables()
