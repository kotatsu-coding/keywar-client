import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'
import useSocket from '../../hooks/useSocket'
import { IUser } from '../RoomPage'
import styled from 'styled-components'

interface IRoom {
  id: number,
  users: IUser[]
}

const RoomItemBlock = styled.div`
  border: 1px solid black;
  width: 100px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`

interface IRoomItemProps {
  key?: any,
  onClick: () => void,
  children: React.ReactNode
}

const RoomItem = ({ onClick, children }: IRoomItemProps) => {
  return (
    <RoomItemBlock onClick={onClick}>
      { children }
    </RoomItemBlock>
  )
}

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
    return () => {
      if (socket) {
        socket.off('room', handleNewRoom)
      }
    }
  }, [socket, isConnected, me])

  return (
    <div>
      Hi, { me?.username } !
      <button onClick={createRoom}>Create room</button>
      {
        rooms.map((room, index) => (
          <RoomItem key={index} onClick={() => handleJoinRoom(room.id)}>
            Room {room.id}
          </RoomItem>
        ))
      }
    </div>
  )
}

export default LobbyPage