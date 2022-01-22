import React, { useEffect, useRef, useState } from 'react'
import { GameRoom } from '../components/Game/GameRoom'
import { GameInfoContainer } from '../components/GameInfo/GameInfoContainer'
import { io } from 'socket.io-client'
import classNames from 'classnames/bind'
import styles from './MainPage.module.scss'
import { player } from '../types/player'
import namer from 'korean-name-generator'
import { constants } from '../helpers/constants'

const cx = classNames.bind(styles)

const MainPage: React.FC = () => {
  const [players, setPlayers] = useState<Array<player>>([])
  const [gametime, setGametime] = useState(constants.GAME_DURATION)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameInfo, setGameInfo] = useState({})

  const name: string = `${namer.generate(true)}`

  const socket = useRef<any>(null)
  const intervalID = useRef<any>(null)

  useEffect(() => {
    socket.current = io('https://moon-test.ngrok.io/', {
      transports: ['websocket'],
    })

    socket.current.on('connect', () => {
      console.time()
      socket.current.emit('user join', { username: name })
    })

    socket.current.on('current users', (event: any) => {
      setPlayers(event.users)
      console.log(event)
      console.timeEnd()
    })

    socket.current.on('error', (event: any) => console.log(event))

    socket.current.on('server game start', (event: any) => {
      setGameStarted(true)
    })

    socket.current.on('current game info', (event: any) => {
      setGameInfo(event.game)
    })

    return () => {
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (gameStarted) {
      intervalID.current = setInterval(() => {
        setGametime((prevGametime) => prevGametime - 1)
      }, 1000)
    }
  }, [gameStarted])

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
        gameStarted={gameStarted}
        setGameStarted={setGameStarted}
      />
    </div>
  )
}

export { MainPage }
