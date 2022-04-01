import pgtools from 'pgtools'

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
}

pgtools.dropdb(config, process.env.DB_NAME, (err, res) => {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
  console.log(res)
})
