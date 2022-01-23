import React, { useEffect, useState } from 'react'
import { GameDisplay } from './GameDisplay'
import styles from './GameRoom.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)
interface IProps {
  socket: any,
  gametime: number,
  gameInfo: any,
  gameStatus: string,
  onKeyStroke: (key: string) => void
}

const GameRoom: React.FC<IProps> = ({
  gameInfo,
  gameStatus,
  socket,
  gametime,
  onKeyStroke
}) => {
  const handleStartClick = () => {
    socket.current.emit('game start', { game_time: 60 })
  }

  return (
    <div 
      className={cx('wrapper')}
      onKeyDown={(event: any) => onKeyStroke(event.key)}
      tabIndex={0}
    >
      <div className={cx('top')}>
        <div className={cx('score')}>{gameInfo.teams[0].score} {gameInfo.teams[1].score}</div>
        <div className={cx('timer')}>{gametime}</div>
      </div>
      <div className={cx('middle')}>
        <GameDisplay team={gameInfo.teams[0]} gameStatus={gameStatus} />
        <GameDisplay team={gameInfo.teams[1]} gameStatus={gameStatus} />
        <button type='button' onClick={handleStartClick}>
          Start
        </button>
      </div>
    </div>
  )
}

export { GameRoom }
