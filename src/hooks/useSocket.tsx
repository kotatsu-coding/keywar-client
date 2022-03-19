import React, { createContext, useContext, useRef, useState } from 'react'
import { Manager } from 'socket.io-client'

interface ISocketManagerProvider {
  children: React.ReactNode
}

interface ISocketManagerContext {
  manager: InstanceType<typeof Manager>,
  isAuthenticated: boolean,
  authenticate: () => void
}

const manager = new Manager({
  transports: ['websocket'],
  autoConnect: false
})

const SocketManagerContext = createContext<ISocketManagerContext>({
  manager,
  isAuthenticated: false,
  authenticate: () => {}
})

export const SocketManagerProvider = ({ children }: ISocketManagerProvider) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const authenticate = () => {
    const socket = manager.socket('/', {
      auth: {
        token: sessionStorage.getItem('keywar-token')
      }
    })
    const handleConnect = () => {
      setIsAuthenticated(true)
      socket.off('connect', handleConnect)
    }
    socket.on('connect', handleConnect)
    socket.on('error', () => {
      socket.disconnect()
    })
    socket.connect()
  }

  return (
    <SocketManagerContext.Provider
      value={{
        manager,
        isAuthenticated,
        authenticate
      }}
    >
      { children }
    </SocketManagerContext.Provider>
  )
}

export const useSocket = (namespace: string = '') => {
  const { manager, authenticate, isAuthenticated } = useContext(SocketManagerContext)
  const socket = useRef<any>(manager.socket(`/${namespace}`))

  return {
    socket: isAuthenticated ? socket.current : null,
    authenticate
  }
}