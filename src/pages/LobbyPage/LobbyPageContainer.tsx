import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'
import { useSocket } from '../../hooks'
import { IRoom } from '../../types'
import LobbyPagePresenter from './LobbyPagePresenter'


const LobbyPage = () => {
  const me = useRecoilValue(meState)
  const history = useHistory()
  const { socket, isConnected } = useSocket('lobby')
  const [rooms, setRooms] = useState<IRoom[]>([])

  const handleNewRoom = (event: any) => {
    const roomId = event.room_id
    history.push(`/room/${roomId}`)
  }

  const handleRooms = (data: any) => {
    setRooms(data.rooms)
  }

  const createRoom = () => {
    socket.emit('create_room')
  }

  const handleJoinRoom = (roomId: number) => {
    history.push(`/room/${roomId}`)
  }

  useEffect(() => {
    if (!isConnected) return () => {}
    if (!me) {
      socket.emit('create_user')
    }

    socket.emit('get_rooms')

    socket.on('room', handleNewRoom)
    socket.on('rooms', handleRooms)
  }, [socket, isConnected, me])

  return (
    <LobbyPagePresenter 
      rooms={rooms}
      createRoom={createRoom}
      joinRoom={handleJoinRoom}
    />
  )
}

export default LobbyPage