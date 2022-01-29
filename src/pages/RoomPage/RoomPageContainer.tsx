import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRecoilState } from 'recoil'
import { meState } from '../../atoms/me'
import { useSocket, useTimer, useAudio } from '../../hooks'
import { IUser, ITeam, EAudio, EGameStatus } from '../../types'
import RoomPagePresenter from './RoomPagePresenter'

interface IRoomPageParams {
  roomId: string 
}

const RoomPage = () => {
  const { roomId } = useParams<IRoomPageParams>()
  const { socket, isUserSynced } = useSocket('room')
  const { startTimer, remainingTime } = useTimer(60)
  const [users, setUsers] = useState<IUser[]>([])
  const [myTeam, setMyTeam] = useState<ITeam>()
  const [opponent, setOpponent] = useState<ITeam>()
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [gameStatus, setGameStatus] = useState<EGameStatus>(EGameStatus.IDLE)
  const [me, setMe] = useRecoilState(meState)
  const history = useHistory()
  const playAudio = useAudio()

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
    if (isUserSynced && users.length === 4) {
      socket.emit('game_start')
    }
  }

  const handleGameStart = () => {
    console.log('GAME START!')
    setGameStatus(EGameStatus.PLAYING)
  }

  const updateMyTeam = (data: ITeam) => {
    if (!myTeam) setMyTeam(data)
    else if (data.current_word.current_idx === 0) {
      setMyTeam(data)
      playAudio(EAudio.SUCCESS)
    }
    else if (data.current_word.current_idx > myTeam.current_word.current_idx) {
      setMyTeam(data)
      playAudio(EAudio.FAILURE)
    }
  }

  const handleUpdateGame = (data: any) => {
    console.log('UPDATE GAME', data)
    if (data.users.map((user: IUser) => user.id).includes(me?.id)) {
      updateMyTeam(data)
    } else {
      setOpponent(data)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    console.log('KEY DOWN')
    if (myTeam && me && me.color && gameStatus === EGameStatus.PLAYING) {
      const currentKey = myTeam?.current_word.value[myTeam.current_word.current_idx]
      const currentColor = myTeam?.current_word.colors[myTeam.current_word.current_idx]
      let nextIdx
      if (currentKey === event.key && currentColor === me.color) {
        nextIdx = myTeam.current_word.current_idx + 1
        playAudio(EAudio.SUCCESS)
      } else {
        nextIdx = 0
        playAudio(EAudio.FAILURE)
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
    setGameStatus(EGameStatus.FINISHED)
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
    if (gameStatus === EGameStatus.PLAYING) {
      startTimer()
    }

  }, [gameStatus])

  useEffect(() => {
    if (me?.is_host && remainingTime <= 0) {
      socket.emit('game_finished')
    }
  }, [remainingTime])

  return (
    <RoomPagePresenter 
      myTeam={myTeam}
      opponent={opponent}
      users={users}
      remainingTime={remainingTime}
      onKeyDown={handleKeyDown}
      startGame={handleClickStart}
      gameStatus={gameStatus}
      socket={socket}
      isJoined={isJoined}
    />
  )
}

export default RoomPage