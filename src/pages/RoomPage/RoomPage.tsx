import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRecoilState, useRecoilValue } from 'recoil'
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

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
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
  const [me, setMe] = useRecoilState(meState)
  const history = useHistory()

  const handleUsers = (data: any) => {
    setUsers(data.users)
  }

  const handleJoined = (data: any) => {
    setIsJoined(true)
    setMe(data.user)
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
    if (teams.length === 0) {
      setTeams([data.team_1, data.team_2])
    } else {
      let users = teams[0].users.filter(user => user.id === me?.id)
      if (users.length > 0) {
        const currentSequence = teams[0].current_word.sequence
        const serverSequence = data.team_1.current_word.sequence
        const newSequence = synchronizeSequence(currentSequence, serverSequence)
        setTeams([{
          ...data.team_1,
          current_word: {
            ...data.team_1.current_word,
            sequence: newSequence
          }
        }, data.team_2])
      } else {
        const currentSequence = teams[1].current_word.sequence
        const serverSequence = data.team_2.current_word.sequence
        const newSequence = synchronizeSequence(currentSequence, serverSequence)
        setTeams([data.team_1, {
          ...data.team_2,
          current_word: {
            ...data.team_2.current_word,
            sequence: newSequence
          }
        }])
      }
    }
  }

  const synchronizeSequence = (currentSequence: string[][], serverSequence: string[][]) => {
    let i = 0
    let j = 0
    const newSequence = []
    while (i < currentSequence.length || j < serverSequence.length) {
      if (j >= serverSequence.length) {
        newSequence.push(currentSequence[i])
        i += 1
        continue
      }
      if (i >= currentSequence.length) {
        newSequence.push(serverSequence[j])
        j += 1
        continue
      }
      if (currentSequence[i][0] === serverSequence[j][0] && currentSequence[i][1] === serverSequence[j][1]) {
        newSequence.push(currentSequence[i])
        i += 1
        j += 1
        continue
      }
      newSequence.push(serverSequence[j])
      j += 1
    }
    return newSequence
  }

  const updateSequence = ([color, key]: string[]) => {
    let users = teams[0].users.filter(user => user.id === me?.id)
    if (users.length > 0) {
      setTeams([{
        ...teams[0],
        current_word: {
          ...teams[0].current_word,
          sequence: [...teams[0].current_word.sequence, [color, key]]
        }
      }, teams[1]])
    } else {
      setTeams([teams[0], {
        ...teams[1],
        current_word: {
          ...teams[1].current_word,
          sequence: [...teams[1].current_word.sequence, [color, key]]
        }
      }])
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (me && me.color && gameStatus === 'playing') {
      socket.emit('stroke_key', {
        key: event.key
      })

      updateSequence([me.color, event.key])
    }
  }

  const handleGameFinished = () => {
    setGameStatus('finished')
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
    socket.on('game_finished', handleGameFinished)

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

  useEffect(() => {
    if (me?.is_host && remainingTime <= 0) {
      socket.emit('game_finished')
    }
  }, [remainingTime])

  return (
    <RoomPageWrapper>
      <TopWrapper>
        { teams.length === 2 && 
          <>
            <TopContent>
              Time:{ remainingTime.toFixed(2) }
            </TopContent>
            <TopContent>
              Score (team 1): {teams[0].score}
            </TopContent>
            <TopContent>
              Score (teama 2): {teams[1].score}
            </TopContent>
          </>
      }
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
              <button onClick={handleClickStart} disabled={gameStatus === 'playing'}>Start</button>
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