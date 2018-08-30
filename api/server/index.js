const Hapi = require('hapi')

const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000
})

server.route({
    method: 'GET',
    path: '/latest-block',
    handler: function (request, h) {
      return 10000
    }
})


async function run() {
  console.log('start api')
  try {
    await server.start()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
  console.log('Server running at:', server.info.uri)
}

module.exports = {
    run
}