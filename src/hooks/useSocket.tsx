import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Manager } from 'socket.io-client'
import { meState } from '../atoms/me'

interface ISocketManagerProvider {
  children: React.ReactNode
}

interface ISocketManagerContext {
  manager: InstanceType<typeof Manager> | null
}

const SocketManagerContext = createContext<ISocketManagerContext>({
  manager: null
})

export const SocketManagerProvider = ({ children }: ISocketManagerProvider) => {
  const managerRef = useRef(new Manager({
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true
  }))

  const manager = managerRef.current

  useEffect(() => {
    const socket = manager.socket('/', {
      auth: {
        token: 'abc'
      }
    })
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
  const socket = useRef<any>(null)
  const [isUserSynced, setIsUserSynced] = useState<boolean>(false)
  const [me, setMe] = useRecoilState(meState)

  const handleConnect = () => {
    console.log(socket.current.io.engine.id)
    if (me) {
      socket.current.emit('user', me)
    }
  }

  const handleUser = (data: any) => {
    setMe(data.user)
    setIsUserSynced(true)
  }

  useEffect(() => {
    if (socket.current === null && manager) {
      socket.current = manager.socket(`/${namespace}`, {
        auth: {
          token: 'abc'
        }
      })
    }
    socket.current.on('connect', handleConnect)
    socket.current.on('user', handleUser)
    return () => {
      if (socket.current) {
        socket.current.off('connect', handleConnect)
        socket.current.off('user', handleUser)
      }
    }
  }, [])


  return {
    socket: socket.current,
    isUserSynced
  }
}