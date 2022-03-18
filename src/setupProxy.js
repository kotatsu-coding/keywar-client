const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware(['/api', '/socket.io'], {
      target: 'http://127.0.0.1:5004',
      //target: 'ws://127.0.0.1:5004', 
      changeOrigin: true, 
      ws: true ,
      router: {
        '/socket.io': 'ws://127.0.0.1:5004'
      }
    })
  )
}