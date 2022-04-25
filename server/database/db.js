import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({
  database: process.env.DB_NAME || 'taskmanagerDB',
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'pass',
  port: process.env.DB_PORT || 5432
})

export default pool
