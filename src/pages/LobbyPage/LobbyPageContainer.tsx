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

  const createRoom = (capacity: number) => {
    socket.emit('create_room', { capacity })
  }

  const handleJoinRoom = (roomId: number) => {
    history.push(`/room/${roomId}`)
  }

  useEffect(() => {
    if (!me) {
      socket.emit('create_user')
    }
  })

  useEffect(() => {
    if (!isConnected) return () => {}
    console.log('AAAA')

    socket.emit('get_rooms')

    socket.on('room', handleNewRoom)
    socket.on('rooms', handleRooms)
    return () => {
      socket.off('room', handleNewRoom)
      socket.off('rooms', handleRooms)
    }
  }, [isConnected])

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