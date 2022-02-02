import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useSetRecoilState } from 'recoil'
import { meState } from '../atoms/me'
import { IRoom } from '../types'

interface IUseRoomProps {
  roomId: number,
  socket: any,
  isUserSynced: boolean
}

const useRoom = ({
  roomId, 
  socket, 
  isUserSynced
}: IUseRoomProps) => {
  const [room, setRoom] = useState<IRoom>()
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const setMe = useSetRecoilState(meState)
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
    setMe(newMe)
  }

  const handleRoomFull = () => {
    history.push('/')
  }

  useEffect(() => {
    if (socket && isUserSynced) {
      socket.emit('join', {
        room_id: roomId
      })

      socket.on('joined', handleJoined)
      socket.on('room', handleRoom)
      socket.on('room_full', handleRoomFull)
    }
  }, [socket, isUserSynced])

  return {
    room,
    isJoined
  }
}

export default useRoom