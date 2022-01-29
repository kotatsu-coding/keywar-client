import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRecoilState } from 'recoil'
import { meState } from '../../atoms/me'
import useSocket from '../../hooks/useSocket'
import useTimer from '../../hooks/useTimer'
import RoomPagePresenter, { TGameStatus } from './RoomPagePresenter'
import { IUser, ITeam }from '../../types'

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

  const updateMyTeam = (data: ITeam) => {
    if (!myTeam) setMyTeam(data)
    else if (data.current_word.current_idx === 0) {
      setMyTeam(data)
      const clonedAudio = audioFailRef.current?.cloneNode(true) as HTMLAudioElement
      clonedAudio.play()
    }
    else if (data.current_word.current_idx > myTeam.current_word.current_idx) {
      setMyTeam(data)
      const clonedAudio = audioSuccessRef.current?.cloneNode(true) as HTMLAudioElement
      clonedAudio.play()

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
    if (myTeam && me && me.color && gameStatus === 'playing') {
      const currentKey = myTeam?.current_word.value[myTeam.current_word.current_idx]
      const currentColor = myTeam?.current_word.colors[myTeam.current_word.current_idx]
      let nextIdx
      if (currentKey === event.key && currentColor === me.color) {
        nextIdx = myTeam.current_word.current_idx + 1
        const clonedAudio = audioSuccessRef.current?.cloneNode(true) as HTMLAudioElement
        clonedAudio.play()
      } else {
        nextIdx = 0
        const clonedAudio = audioFailRef.current?.cloneNode(true) as HTMLAudioElement
        clonedAudio.play()
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
      audioSuccessRef={audioSuccessRef}
      audioFailRef={audioFailRef}
    />
  )
}

export default RoomPage