import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({
  database: 'taskmanagerDB',
  user: 'user',
  host: 'localhost',
  password: 'pass',
  port: 5432
})

export default pool
