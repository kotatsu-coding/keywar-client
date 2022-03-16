import { Manager } from 'socket.io-client'

const manager = new Manager('/', {
  transports: ['websocket'],
  autoConnect: false
})

export { manager }