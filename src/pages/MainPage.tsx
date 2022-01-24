import React, { useEffect, useRef, useState } from 'react'
import { GameRoom } from '../components/Game/GameRoom'
import { GameInfoContainer } from '../components/GameInfo/GameInfoContainer'
import { io } from 'socket.io-client'
import classNames from 'classnames/bind'
import styles from './MainPage.module.scss'
import { IPlayer } from '../types/player'
import namer from 'korean-name-generator'
import { constants } from '../helpers/constants'
import { useTimer } from '../hooks/useTimer'

const cx = classNames.bind(styles)

export interface IMe {
  username: string,
  color: string
}

interface ITeam {
  score: number,
  sequence: string[][],
  current_word: any,
  users: any[]
}

interface IGameInfo {
  teams: ITeam[]
}

type TGameStatus = 'idle' | 'playing' | 'finished'

const MainPage: React.FC = () => {
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [gameStatus, setGameStatus] = useState<TGameStatus>('idle')
  const [gameInfo, setGameInfo] = useState<IGameInfo>({
    teams: [{ 
      score: 0,
      users: [],
      sequence: [],
      current_word: ''
    }, { 
      score: 0,
      users: [],
      sequence: [],
      current_word: ''
    }]
  })
  const [me, setMe] = useState<IMe>({
    username: `${namer.generate(true)}`,
    color: ''
  })
  const { startTimer, remainingTime } = useTimer(constants.GAME_DURATION)

  const handleKeyStroke = (key: string) => {
    if (gameStatus === 'playing') {
      socket.current.emit('stroke key', key)
    }
  }

  const socket = useRef<any>(null)
  console.log(gameStatus)

  useEffect(() => {
    socket.current = io('http://localhost:5004', {
      transports: ['websocket'],
    })

    socket.current.on('connect', () => {
      console.time()
      socket.current.emit('user join', { username: me.username })
    })

    socket.current.on('current users', (event: any) => {
      setPlayers(event.users)
      event.users.forEach((user: any) => {
        if (user.username === me.username) {
          setMe({
            ...me,
            color: user.color
          })
        }
      })
      console.log(event)
      console.timeEnd()
    })

    socket.current.on('error', (event: any) => console.log(event))

    socket.current.on('server game start', (event: any) => {
      console.log('server game start', event)
      setGameStatus('playing')
      startTimer()
    })

    socket.current.on('current game info', (event: any) => {
      console.log(event.game)
      setGameInfo(event.game)
    })

    return () => {
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (remainingTime <= 0) {
      console.log(remainingTime)
      setGameStatus('finished')
    }
  }, [remainingTime])


  return (
    <div className={cx('wrapper')}>
      <GameInfoContainer me={me} players={players} />
      <GameRoom
        socket={socket}
        gametime={remainingTime}
        gameInfo={gameInfo}
        gameStatus={gameStatus}
        onKeyStroke={handleKeyStroke}
      />
    </div>
  )
}

export { MainPage }
