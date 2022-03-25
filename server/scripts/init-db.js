import pg from 'pg'

const pool = new pg.Pool({
  database: 'taskmanagerDB',
  user: 'user',
  host: '127.0.0.1',
  password: 'pass',
  port: 5432
})

pool.query(
  `CREATE TABLE IF NOT EXISTS public.users
  (
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    isAdmin boolean DEFAULT FALSE NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(200) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
  )`,
  (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
  }
)

pool.query(
  `CREATE TABLE IF NOT EXISTS public.tasks
  (
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    title character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description character varying(300) COLLATE pg_catalog."default" NOT NULL,
    status SMALLINT DEFAULT 0 NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    creator character varying(36) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tasks_pkey PRIMARY KEY (id)
  )`,
  (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
  }
)
