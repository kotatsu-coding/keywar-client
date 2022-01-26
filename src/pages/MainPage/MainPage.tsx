/*
import React, { useEffect, useRef, useState } from 'react'
import { GameRoom } from '../../components/Game/GameRoom'
import { GameInfoContainer } from '../../components/GameInfo/GameInfoContainer'
import { io } from 'socket.io-client'
import classNames from 'classnames/bind'
import styles from './MainPage.module.scss'
import { IPlayer } from '../../types/player'
import { constants } from '../../helpers/constants'
import { useTimer } from '../../hooks/useTimer'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { gameStatusState } from '../../atoms/gameStatus'
import { meState } from '../../atoms/me'
import { gameInfoState } from '../../atoms/gameInfo'


const cx = classNames.bind(styles)
*/

const MainPage: React.FC = () => {
  /*
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [me, setMe] = useRecoilState(meState)
  const [gameStatus, setGameStatus] = useRecoilState(gameStatusState)
  const setGameInfo = useSetRecoilState(gameInfoState)
  const { startTimer, remainingTime } = useTimer(constants.GAME_DURATION)

  const handleKeyStroke = (key: string) => {
    if (gameStatus === 'playing') {
      socket.current.emit('stroke key', key)
    }
  }

  const socket = useRef<any>(null)

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
  }, [remainingTime,  setGameStatus])

  return (
    <div className={cx('wrapper')}>
      <GameInfoContainer players={players} />
      <GameRoom
        socket={socket}
        gametime={remainingTime}
        onKeyStroke={handleKeyStroke}
      />
    </div>
  )
  */
  return (<div></div>)
}

export default MainPage
