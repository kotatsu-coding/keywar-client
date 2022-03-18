import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useSocket } from '../../hooks'
import { useMe } from '../../hooks/useMe'
import { IRoom } from '../../types'
import LobbyPagePresenter from './LobbyPagePresenter'

const LobbyPage = () => {
  const history = useHistory()
  const { socket } = useSocket('lobby')
  const [rooms, setRooms] = useState<IRoom[]>([])
  const { me } = useMe()

  const createRoom = (capacity: number) => {
    socket.emit('create_room', { capacity })
  }

  const handleJoinRoom = (roomId: number) => {
    history.push(`/room/${roomId}`)
  }

  useEffect(() => {
    const handleConnect = () => {
      socket.emit('get_rooms')
    }

    const handleNewRoom = (event: any) => {
      const roomId = event.room_id
      history.push(`/room/${roomId}`)
    }

    const handleRooms = (data: any) => {
      setRooms(data.rooms)
    }

    if (socket) {
      socket.on('connect', handleConnect)
      socket.on('room', handleNewRoom)
      socket.on('rooms', handleRooms)
      socket.connect()
    }
    return () => {
      if (socket) {
        socket.off('room', handleNewRoom)
        socket.off('rooms', handleRooms)
        socket.disconnect()
      }
    }
  }, [socket])

  return (
    <LobbyPagePresenter 
      me={me}
      rooms={rooms}
      createRoom={createRoom}
      joinRoom={handleJoinRoom}
    />
  )
}

export default LobbyPage