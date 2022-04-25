import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({
  database: process.env.DB_NAME || 'taskmanagerDB',
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'pass',
  port: process.env.DB_PORT || 5432
})

pool.query(
  `CREATE TABLE IF NOT EXISTS public.users
  (
    id character(36) COLLATE pg_catalog."default" NOT NULL,
    isAdmin boolean DEFAULT FALSE NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character(60) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
  );
  CREATE TABLE IF NOT EXISTS public.taskLists
  (
    id character(36) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    creator character(36) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT taskLists_pkey PRIMARY KEY (id),
    CONSTRAINT taskLists_fkey FOREIGN KEY (creator) REFERENCES users (id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS public.tasks
  (
    id character(36) COLLATE pg_catalog."default" NOT NULL,
    title character varying(50) COLLATE pg_catalog."default" NOT NULL,
    description character varying(500) COLLATE pg_catalog."default" NOT NULL,
    status SMALLINT DEFAULT 0 NOT NULL,
    deadline TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT (NOW() + interval '6 hours'),
    list_id character(36) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_fkey FOREIGN KEY (list_id) REFERENCES taskLists (id) ON DELETE CASCADE
  );`,
  (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
  }
)
