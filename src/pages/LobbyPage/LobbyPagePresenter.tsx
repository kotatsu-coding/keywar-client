import React from 'react'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'
import { IRoom } from '../../types'
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

const RoomItem = ({ onClick, children }: IRoomItemProps) => {
  return (
    <RoomItemBlock onClick={onClick}>
      { children }
    </RoomItemBlock>
  )
}

interface ILobbyPagePresenterProps {
  rooms: IRoom[],
  createRoom: any,
  joinRoom: (roomId: number) => void
}

const LobbyPagePresenter = ({
  rooms,
  createRoom,
  joinRoom 
}: ILobbyPagePresenterProps) => {
  const me = useRecoilValue(meState)
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