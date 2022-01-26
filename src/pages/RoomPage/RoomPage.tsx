import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'
import TeamDisplay from '../../components/TeamDisplay'
import MainDisplay from '../../components/MainDisplay'
import ChatBox from '../../components/ChatBox'
import styled from 'styled-components'
import useSocket from '../../hooks/useSocket'
import useTimer from '../../hooks/useTimer'

interface IRoomPageParams {
  roomId: string 
}

export interface IUser {
  id: number,
  username: string,
  color: string
}

export interface IWord {
  value: string,
  colors: string[],
  current_idx: number,
  sequence: string[][]
}

export interface ITeam {
  current_word: IWord,
  score: number,
  users: IUser[]
}

const RoomPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`

const TopWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
`

const MainWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60%;
  border: 1px solid black;
`

const ControllerWrapper = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
`

const BottomWrapper = styled.div`
  flex: 1;
`

type TGameStatus = 'idle' | 'playing' | 'finished'


const RoomPage = () => {
  const { roomId } = useParams<IRoomPageParams>()
  const { socket, isUserSynced } = useSocket('room')
  const { startTimer, remainingTime } = useTimer(60)
  const [users, setUsers] = useState<IUser[]>([])
  const [teams, setTeams] = useState<ITeam[]>([])
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<TGameStatus>('idle')
  const me = useRecoilValue(meState)
  const history = useHistory()

  const handleUsers = (data: any) => {
    console.log(data.users)
    setUsers(data.users)
  }

  const handleJoined = () => {
    setIsJoined(true)
  }

  const handleRoomFull = () => {
    history.push('/')
  }

  const handleClickStart = () => {
    if (isUserSynced /*&& users.length === 4*/) {
      socket.emit('game_start')
    }
  }

  const handleGameStart = () => {
    console.log('GAME START!')
    setGameStatus('playing')
  }

  const handleUpdateGame = (data: any) => {
    setTeams([data.team_1, data.team_2])
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (gameStatus === 'playing') {
      socket.emit('stroke_key', {
        key: event.key
      })
    }
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
    socket.on('room_full', handleRoomFull)
    socket.on('game_start', handleGameStart)
    socket.on('update_game', handleUpdateGame)

    return () => {
      if (socket) {
        socket.off('joined', handleJoined)
      }
    }
  }, [isUserSynced])

  useEffect(() => {
    if (gameStatus === 'playing') {
      startTimer()
    }

  }, [gameStatus])

  return (
    <RoomPageWrapper>
      <TopWrapper>
        { remainingTime }
      </TopWrapper>
      <MainWrapper 
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <TeamDisplay users={users.slice(0, 2)} />
        <MainDisplay teams={teams} />
        <TeamDisplay users={users.slice(2)} />
      </MainWrapper>
      <ControllerWrapper>
        {
          me?.is_host ? (
            <div>
              <button onClick={handleClickStart}>Start</button>
            </div>
          )
          : (
            <div></div>
          )
        }
      </ControllerWrapper>
      <BottomWrapper>
        <ChatBox socket={socket} isJoined={isJoined} />
      </BottomWrapper>
    </RoomPageWrapper>
  )
}

export default RoomPage