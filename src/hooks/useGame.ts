import { useEffect, useState } from 'react'
import { EGameStatus, EAudio, IGameTeam, IGame, IUser } from '../types'
import useAudio from './useAudio'
import { useMe } from './useMe'

interface IUseGameProps {
  socket: any,
  isJoined: boolean
}

const useGame = ({
  socket, 
  isJoined
}: IUseGameProps) => {
  const [game, setGame] = useState<IGame>({
    gameStatus: EGameStatus.IDLE,
    teams: []
  })
  const { me } = useMe()

  const playAudio = useAudio()

  const handleGameStart = () => {
    setGame(prevGame => ({
      ...prevGame,
      gameStatus: EGameStatus.PLAYING
    }))
  }

  const handleGameFinished = () => {
    setGame(prevGame => ({
      ...prevGame, 
      gameStatus: EGameStatus.FINISHED
    }))
  }

  const updateTeam = (data: IGameTeam) => {
    setGame(prevGame => {
      const filteredTeams = prevGame.teams.filter((team: IGameTeam) => team.id === me?.team_id)
      if (filteredTeams.length === 0) {
        return {
          ...prevGame,
          teams: [data]
        }
      } else {
        return {
          ...prevGame,
          teams: prevGame.teams.map((team: IGameTeam) => {
            if (team.id === data.id) return data
            return team
          })
        }
      }
    })
  }

  const updateMyTeam = (data: IGameTeam) => {
    const filteredTeam = game.teams.filter(team => team.id === me?.team_id)

    if (filteredTeam.length === 0) updateTeam(data)
    else if (data.current_word.current_idx === 0) {
      updateTeam(data)
      playAudio(EAudio.SUCCESS)
    }
    else if (data.current_word.current_idx > filteredTeam[0].current_word.current_idx) {
      updateTeam(data)
      playAudio(EAudio.FAILURE)
    }
  }

  const handleUpdateTeam = (data: any) => {
    const { team } = data
    if (team.users.map((user: IUser) => user.id).includes(me?.id)) {
      updateMyTeam(team)
    } else {
      updateTeam(team)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (me && me.color && game.gameStatus === EGameStatus.PLAYING) {
      const myTeam = game.teams.filter(team => team.id === me.team_id)[0]
      const currentKey = myTeam.current_word.value[myTeam.current_word.current_idx]
      const currentColor = myTeam.current_word.colors[myTeam.current_word.current_idx]
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
      updateTeam({
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
      socket.on('update_team', handleUpdateTeam)
      socket.on('game_finished', handleGameFinished)
    }
  }, [socket, isJoined])

  return {
    startGame,
    finishGame,
    game,
    handleKeyDown
  }
}

export default useGame