import React, { createContext, useContext, useEffect, useRef } from 'react'
import { Manager } from 'socket.io-client'

interface ISocketManagerProvider {
  children: React.ReactNode
}

interface ISocketManagerContext {
  manager: InstanceType<typeof Manager>
}

const manager = new Manager({
  transports: ['websocket'],
  autoConnect: false
})

const SocketManagerContext = createContext<ISocketManagerContext>({ manager })

export const SocketManagerProvider = ({ children }: ISocketManagerProvider) => {
  useEffect(() => {
    const socket = manager.socket('/')
    socket.connect()
    return () => {
      socket.disconnect()
    }
  },  [])

  return (
    <SocketManagerContext.Provider value={{
      manager
    }}>
      { children }
    </SocketManagerContext.Provider>
  )
}

export const useSocket = (namespace: string = '') => {
  const { manager } = useContext(SocketManagerContext)
  const socket = useRef<any>(manager.socket(`/${namespace}`))

  return {
    socket: socket.current
  }
}