import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { IRoom } from '../types'

interface IUseRoomProps {
  roomId: number,
  socket: any
}

const useRoom = ({
  roomId, 
  socket
}: IUseRoomProps) => {
  const [room, setRoom] = useState<IRoom>()
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const history = useHistory()

  const handleRoom = (data: any) => {
    setRoom(data.room)
  }

  const handleJoined = (data: any) => {
    setIsJoined(true)
    const newMe = data.user
    if (newMe.color === 'red' || newMe.color === 'blue') {
      newMe.team_id = 1
    } else {
      newMe.team_id = 2
    }
    // setMe(newMe)
  }

  const handleRoomFull = () => {
    history.push('/')
  }

  useEffect(() => {
    if (socket) {
      socket.emit('join', {
        room_id: roomId
      })

      socket.on('joined', handleJoined)
      socket.on('room', handleRoom)
      socket.on('room_full', handleRoomFull)
    }
    return () => {
      if (socket) {
        socket.off('joined', handleJoined)
        socket.off('room', handleRoom)
        socket.off('room_full', handleRoomFull)
      }
    }
  }, [socket])

  return {
    room,
    isJoined
  }
}

export default useRoom