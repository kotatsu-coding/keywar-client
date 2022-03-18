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
  return (<div />)
  /*
  const { roomId } = useParams<IRoomPageParams>()
  const { socket } = useSocket('room')
  const { startTimer, remainingTime } = useTimer(60)
  const me = useRecoilValue(meState)

  const { room, isJoined } = useRoom({ roomId: parseInt(roomId), socket, isUserSynced })
  const { startGame, finishGame, game, handleKeyDown } = useGame({ socket, isJoined })

  const handleClickStart = () => {
    if (isUserSynced) {
      startGame()
    }
  }

  useEffect(() => {
    if (game.gameStatus === EGameStatus.PLAYING) {
      startTimer()
    }
  }, [game.gameStatus])

  useEffect(() => {
    if (me?.is_host && remainingTime <= 0) {
      finishGame()
    }
  }, [remainingTime])

  return (
    <RoomPagePresenter 
      me={me}
      room={room}
      game={game}
      remainingTime={remainingTime}
      onKeyDown={handleKeyDown}
      startGame={handleClickStart}
      socket={socket}
      isJoined={isJoined}
    />
  )
  */
}

export default RoomPage