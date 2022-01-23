import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GameRoom } from '../components/Game/GameRoom'
import { GameInfoContainer } from '../components/GameInfo/GameInfoContainer'
import { io } from 'socket.io-client'
import classNames from 'classnames/bind'
import styles from './MainPage.module.scss'
import { IPlayer } from '../types/player'
import namer from 'korean-name-generator'
import { constants } from '../helpers/constants'

const cx = classNames.bind(styles)

interface IMe {
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
  const [gametime, setGametime] = useState(constants.GAME_DURATION)
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

  

  const handleKeyStroke = (key: string) => {
    if (gameStatus === 'playing') {
      socket.current.emit('stroke key', key)
    }
  }

  const socket = useRef<any>(null)
  const intervalID = useRef<any>(null)

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
    })

    socket.current.on('server game finished', () => {
      setGameStatus('finished')
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
    if (gameStatus === 'playing') {
      intervalID.current = setInterval(() => {
        setGametime((prevGametime) => prevGametime - 1)
      }, 1000)
    }
  }, [gameStatus])

  useEffect(() => {
    if (gametime <= 0) {
      clearInterval(intervalID.current)
    }
  })


  return (
    <div className={cx('wrapper')}>
      <GameInfoContainer players={players} />
      <GameRoom
        socket={socket}
        gametime={gametime}
        gameInfo={gameInfo}
        gameStatus={gameStatus}
        onKeyStroke={handleKeyStroke}
      />
    </div>
  )
}

export { MainPage }
