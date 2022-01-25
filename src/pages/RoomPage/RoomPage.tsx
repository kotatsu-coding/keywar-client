import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'
import TeamDisplay from '../../components/TeamDisplay'
import MainDisplay from '../../components/MainDisplay'
import ChatBox from '../../components/ChatBox'
import styled from 'styled-components'
import useSocket from '../../hooks/useSocket'

interface IRoomPageParams {
  roomId: string 
}

export interface IUser {
  id: number,
  username: string
}

const RoomPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`

const MainWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60%;
  border: 1px solid black;
`

const BottomWrapper = styled.div`
  flex: 1;
`


const RoomPage = () => {
  const { roomId } = useParams<IRoomPageParams>()
  const { socket, isUserSynced } = useSocket('room')
  const [users, setUsers] = useState<IUser[]>([])
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const me = useRecoilValue(meState)

  const handleUsers = (data: any) => {
    setUsers(data.users)
  }

  const handleJoined = () => {
    setIsJoined(true)
  }

  useEffect(() => {
    if (!isUserSynced) return () => {}

    if (me) {
      socket.emit('join', {
        room_id: roomId
      })
    }

    socket.on('users', handleUsers)
    socket.on('joined', handleJoined)

    return () => {
      if (socket) {
        socket.off('joined', handleJoined)
      }
    }
  }, [isUserSynced])

  return (
    <RoomPageWrapper>
      <MainWrapper>
        <TeamDisplay users={users.slice(0, 2)} />
        <MainDisplay />
        <TeamDisplay users={users.slice(2)} />
      </MainWrapper>
      <BottomWrapper>
        <ChatBox socket={socket} isJoined={isJoined} />
      </BottomWrapper>
    </RoomPageWrapper>
  )
}

export default RoomPage