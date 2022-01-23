import styles from './GameFinished.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface IGameFinished {
  isVisible: boolean,
  gameStart: () => void
}

const GameFinished = ({
  isVisible,
  gameStart
}: IGameFinished) => {
  return (
    <div 
      className={cx('wrapper', {
        open: isVisible
      })}
    >
      <div
        className={cx('content')}
      >
        Game End
      </div>
      <div
        className={cx('footer')}
      >
        <button onClick={gameStart}>Restart</button>
      </div>
    </div>
  )
}

export { GameFinished }