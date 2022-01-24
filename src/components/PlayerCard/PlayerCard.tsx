import React from 'react'
import styles from './PlayerCard.module.scss'
import classNames from 'classnames/bind'
import { IPlayer } from '../../types/player'

const cx = classNames.bind(styles)
interface IProps {
  isMe: boolean,
  player: IPlayer,
  avatar: any
}

const PlayerCard: React.FC<IProps> = ({ isMe, player, avatar }) => {
  return (
    <div className={cx('wrapper')}>
      <div className={cx(
        'player', {
          me: isMe
        }
      )}>
        <img className={cx('player__image')} src={avatar} />
        <div className={cx('player__name')}>{player.username}</div>
        <span>{player.color}</span>
      </div>
    </div>
  )
}

export { PlayerCard }
