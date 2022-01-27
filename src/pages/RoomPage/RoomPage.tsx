import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRecoilState } from 'recoil'
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
  padding: 15px 30px;
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
  height: 300px;
`

type TGameStatus = 'idle' | 'playing' | 'finished'


const RoomPage = () => {
  const { roomId } = useParams<IRoomPageParams>()
  const { socket, isUserSynced } = useSocket('room')
  const { startTimer, remainingTime } = useTimer(60)
  const [users, setUsers] = useState<IUser[]>([])
  const [myTeam, setMyTeam] = useState<ITeam>()
  const [opponent, setOpponent] = useState<ITeam>()
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<TGameStatus>('idle')
  const [me, setMe] = useRecoilState(meState)
  const history = useHistory()
  const audioSuccessRef = useRef<HTMLAudioElement | null>(null)
  const audioFailRef = useRef<HTMLAudioElement | null>(null)

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
    if (data.team_1.users.map((user: IUser) => user.id).includes(me?.id)) {
      setMyTeam(data.team_1)
      setOpponent(data.team_2)
    } else {
      setMyTeam(data.team_2)
      setOpponent(data.team_1)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (myTeam && me && me.color && gameStatus === 'playing') {
      const currentKey = myTeam?.current_word.value[myTeam.current_word.current_idx]
      const currentColor = myTeam?.current_word.colors[myTeam.current_word.current_idx]
      let nextIdx
      if (currentKey === event.key && currentColor === me.color) {
        nextIdx = myTeam.current_word.current_idx + 1
      } else {
        nextIdx = 0
      }
      const nextWord = {
        ...myTeam.current_word, 
        current_idx: nextIdx
      }
      setMyTeam({
        ...myTeam,
        current_word: nextWord
      })
      socket.emit('stroke_key', {
        current_word: nextWord
      })
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
        { myTeam && opponent  &&
          <>
            <TopContent>
              Time:{ remainingTime.toFixed(2) }
            </TopContent>
            <TopContent>
              Score (My Team): {myTeam.score}
            </TopContent>
            <TopContent>
              Score (Opponent): {opponent.score}
            </TopContent>
          </>
      }
      </TopWrapper>
      <MainWrapper 
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <TeamDisplay users={users.slice(0, 2)} />
        <MainDisplay teams={(myTeam && opponent) ? [myTeam, opponent] : []} />
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
      <audio src="/sound_success.mp3" ref={audioSuccessRef}></audio>
      <audio src='/sound_fail.mp3' ref={audioFailRef}></audio>
    </RoomPageWrapper>
  )
}

export default RoomPage