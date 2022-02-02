import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { meState } from '../atoms/me'
import { EGameStatus, EAudio, ITeam, IUser } from '../types'
import useAudio from './useAudio'

interface IUseGameProps {
  socket: any,
  isJoined: boolean
}

const useGame = ({
  socket, 
  isJoined
}: IUseGameProps) => {
  const [gameStatus, setGameStatus] = useState<EGameStatus>(EGameStatus.IDLE)
  const [myTeam, setMyTeam] = useState<ITeam>()
  const [opponent, setOpponent] = useState<ITeam>()
  const me = useRecoilValue(meState)
  const playAudio = useAudio()

  const handleGameStart = () => {
    setGameStatus(EGameStatus.PLAYING)
  }

  const handleGameFinished = () => {
    setGameStatus(EGameStatus.FINISHED)
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

  const startGame = () => {
    socket.emit('game_start')
  }

  const finishGame = () => {
    socket.emit('game_finished')
  }

  useEffect(() => {
    if (socket && isJoined) {
      socket.on('game_start', handleGameStart)
      socket.on('update_game', handleUpdateGame)
      socket.on('game_finished', handleGameFinished)
    }
  }, [socket, isJoined])

  return {
    startGame,
    finishGame,
    gameStatus,
    myTeam,
    opponent,
    handleKeyDown
  }
}

export default useGame