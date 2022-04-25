import pgtools from 'pgtools'
import 'dotenv/config'

const config = {
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'pass',
  port: process.env.DB_PORT || 5432
}

pgtools.dropdb(config, process.env.DB_NAME || 'taskmanagerDB', (err, res) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(res)
})
