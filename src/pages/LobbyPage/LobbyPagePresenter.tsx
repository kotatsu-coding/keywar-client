import React from 'react'
import { IMe, IRoom } from '../../types'
import styled from 'styled-components'


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

interface ILobbyPagePresenterProps {
  me: IMe | null,
  rooms: IRoom[],
  createRoom: any,
  joinRoom: (roomId: number) => void
}

const RoomItem = ({ onClick, children }: IRoomItemProps) => {
  return (
    <RoomItemBlock onClick={onClick}>
      { children }
    </RoomItemBlock>
  )
}



const LobbyPagePresenter = ({
  me,
  rooms,
  createRoom,
  joinRoom 
}: ILobbyPagePresenterProps) => {
  return (
    <div>
      Hi, { me?.username } !
      <button onClick={createRoom}>Create room</button>
      {
        rooms.map((room, index) => (
          <RoomItem key={index} onClick={() => joinRoom(room.id)}>
            Room {room.id}
          </RoomItem>
        ))
      }
    </div>
  )
}

export default LobbyPagePresenter