import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useRecoilValue } from 'recoil'
import { meState } from '../../atoms/me'
import { useSocket, useTimer, useRoom, useGame } from '../../hooks'
import { EGameStatus } from '../../types'
import RoomPagePresenter from './RoomPagePresenter'

interface IRoomPageParams {
  roomId: string 
}

const RoomPage = () => {
  const { roomId } = useParams<IRoomPageParams>()
  const { socket, isUserSynced } = useSocket('room')
  const { startTimer, remainingTime } = useTimer(60)
  const me = useRecoilValue(meState)

  const { room, isJoined } = useRoom({ roomId: parseInt(roomId), socket, isUserSynced })
  const { startGame, finishGame, myTeam, opponent, gameStatus, handleKeyDown } = useGame({ socket, isJoined })

  const handleClickStart = () => {
    if (isUserSynced && room && room.users.length === room.capacity) {
      startGame()
    }
  }

  useEffect(() => {
    if (gameStatus === EGameStatus.PLAYING) {
      startTimer()
    }
  }, [gameStatus])

  useEffect(() => {
    if (me?.is_host && remainingTime <= 0) {
      finishGame()
    }
  }, [remainingTime])

  return (
    <RoomPagePresenter 
      me={me}
      myTeam={myTeam}
      opponent={opponent}
      room={room}
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