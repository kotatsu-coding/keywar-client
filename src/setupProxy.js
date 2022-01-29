const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/socket.io', {
      target: 'ws://127.0.0.1:5004', 
      changeOrigin: true, 
      ws: true 
    })
  )
}