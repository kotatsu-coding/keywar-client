import React  from 'react'
import styles from './GameRoom.module.scss'
import classNames from 'classnames/bind'
import { GameDisplay } from './GameDisplay'
import { GameFinished } from './GameFinished'
import { constants } from '../../helpers/constants'
import { useRecoilValue } from 'recoil'
import { gameStatusState } from '../../atoms/gameStatus'
import { gameInfoState } from '../../atoms/gameInfo'

const cx = classNames.bind(styles)

interface IProps {
  socket: any,
  gametime: number,
  onKeyStroke: (key: string) => void
}

const GameRoom: React.FC<IProps> = ({
  socket,
  gametime,
  onKeyStroke
}) => {
  const gameStatus = useRecoilValue(gameStatusState)
  const gameInfo = useRecoilValue(gameInfoState)

  const handleStartClick = () => {
    socket.current.emit('game start', { game_time: constants.GAME_DURATION })
  }

  return (
    <div 
      className={cx('wrapper')}
      onKeyDown={(event: any) => onKeyStroke(event.key)}
      tabIndex={0}
    >
      <div className={cx('top')}>
        <div className={cx('score')}>{gameInfo.teams[0].score} {gameInfo.teams[1].score}</div>
        <div className={cx('timer')}>{gametime.toFixed(2)}</div>
      </div>
      <div className={cx('middle')}>
        <GameDisplay team={gameInfo.teams[0]} gameStatus={gameStatus} />
        <GameDisplay team={gameInfo.teams[1]} gameStatus={gameStatus} />
        <button type='button' onClick={handleStartClick}>
          Start
        </button>
      </div>
      <GameFinished 
        isVisible={
          gameStatus === 'finished'
        } 
        gameStart={handleStartClick}
      />
    </div>
  )
}

export { GameRoom }
