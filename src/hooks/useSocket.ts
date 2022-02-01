import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { io } from 'socket.io-client'
import { meState } from '../atoms/me'

const useSocket = (namespace: string = '') => {
  const socket = useRef<any>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isUserSynced, setIsUserSynced] = useState<boolean>(false)
  const [me, setMe] = useRecoilState(meState)

  useEffect(() => {
    if (socket.current === null) {
      socket.current = io(`/${namespace}`, {
        transports: ['websocket'],
      })
    }

    socket.current.on('connect', () => {
      setIsConnected(true)

      if (me) {
        socket.current.emit('user', me)
      }
    })

    socket.current.on('user', (data: any) => {
      setMe(data.user)
      setIsUserSynced(true)
    })

    return () => {
      if (socket.current) {
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