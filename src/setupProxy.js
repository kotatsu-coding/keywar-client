const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/socket.io', {
      target: 'ws://localhost:5004', 
      changeOrigin: true, 
      ws: true 
    })
  )
}