import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSocket, useTimer, useRoom, useGame } from '../../hooks'
import { useMe } from '../../hooks/useMe'
import { EGameStatus } from '../../types'
import RoomPagePresenter from './RoomPagePresenter'

interface IRoomPageParams {
  roomId: string 
}

const RoomPage = () => {
  const { roomId } = useParams<IRoomPageParams>()
  const { socket } = useSocket('room')
  const { startTimer, remainingTime } = useTimer(60)
  const { me } = useMe()

  const { room, isJoined } = useRoom({ roomId: parseInt(roomId), socket })
  const { startGame, finishGame, game, handleKeyDown } = useGame({ socket, isJoined })

  const handleClickStart = () => {
    startGame()
  }

  useEffect(() => {
    if (socket) {
      socket.connect()
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [socket])

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
}

export default RoomPage