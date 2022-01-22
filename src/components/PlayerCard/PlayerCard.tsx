import React from 'react'
import styles from './PlayerCard.module.scss'
import classNames from 'classnames/bind'
import { player } from '../../types/player'

const cx = classNames.bind(styles)
interface IProps {
  player: player
  avatar: any
}

const PlayerCard: React.FC<IProps> = ({ player, avatar }) => {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('player')}>
        <img className={cx('player__image')} src={avatar} />
        <div className={cx('player__name')}>{player.username}</div>
        <span>{player.color}</span>
      </div>
    </div>
  )
}

export { PlayerCard }
