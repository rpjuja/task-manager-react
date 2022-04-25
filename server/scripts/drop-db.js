import pgtools from 'pgtools'
import 'dotenv/config'

const config = {
  user: 'user',
  host: 'localhost',
  password: 'pass',
  port: 5432
}

pgtools.dropdb(config, 'taskmanagerDB', (err, res) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(res)
})
