import React, { useEffect, useState } from 'react'
import styles from './GameRoom.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)
interface IProps {
  socket: any
  gametime: number
  gameInfo: any
  gameStarted: boolean
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const GameRoom: React.FC<IProps> = ({
  gameInfo,
  socket,
  gametime,
  gameStarted,
  setGameStarted,
}) => {
  useEffect(() => {
    if (gameStarted) {
      document.addEventListener('keydown', (event) => {
        socket.current.emit('stroke key', event.key)
      })
    }
  }, [gameStarted])

  const [isStarted, setIsStarted] = useState<boolean>(false)

  const handleStartClick = () => {
    setIsStarted(true)
    socket.current.emit('game start', { game_time: 60 })
  }

  const getOpaqueSpans = ({
    word,
    colors,
    current_idx,
  }: {
    word: string
    colors: Array<string>
    current_idx: number
  }) => {
    return word.split('').map((character, idx) => (
      <span
        key={idx}
        style={{ color: colors[idx], opacity: idx < current_idx ? 1 : 0.5 }}
      >
        {character}
      </span>
    ))
  }

  const { score, word, current_word } = gameInfo

  return (
    <div className={cx('wrapper')}>
      <div className={cx('top')}>
        <div className={cx('score')}>{score}</div>
        <div className={cx('timer')}>{gametime}</div>
      </div>
      <div className={cx('middle')}>
        <div className={cx('word')}>
          {current_word &&
            getOpaqueSpans({
              word: current_word.value,
              colors: current_word.colors,
              current_idx: current_word.current_idx,
            })}
        </div>
        <button type='button' onClick={handleStartClick}>
          Start
        </button>
      </div>
      <div className={cx('bottom')}>
        <button onClick={() => setGameStarted(true)} disabled={!gameStarted}>
          restart
        </button>
      </div>
    </div>
  )
}

export { GameRoom }
