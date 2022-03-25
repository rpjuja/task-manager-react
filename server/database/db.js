import pg from 'pg'

const pool = new pg.Pool({
  database: 'taskmanagerDB',
  user: 'user',
  host: '127.0.0.1',
  password: 'pass',
  port: 5432
})

export default pool
