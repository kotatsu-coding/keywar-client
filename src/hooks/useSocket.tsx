import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { io } from 'socket.io-client'
import { meState } from '../atoms/me'
import { manager } from '../manager'



const useSocket = (namespace: string = '') => {
  const socket = useRef<any>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isUserSynced, setIsUserSynced] = useState<boolean>(false)
  const [me, setMe] = useRecoilState(meState)

  const handleConnect = () => {
    setIsConnected(true)

    if (me) {
      socket.current.emit('user', me)
    }
  }

  const handleUser = (data: any) => {
    setMe(data.user)
    setIsUserSynced(true)
  }

  useEffect(() => {
    if (socket.current === null) {
      socket.current = manager.socket(`/${namespace}`)
      socket.current.connect()
    }

    socket.current.on('connect', handleConnect)
    socket.current.on('user', handleUser)

    return () => {
      if (socket.current) {
        socket.current.off('connect', handleConnect)
        socket.current.off('user', handleUser)
        socket.current.close()
      }
    }
  }, [])

  return {
    socket: socket.current,
    isConnected,
    isUserSynced
  }
}

export default useSocket