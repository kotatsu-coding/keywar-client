import React from 'react'
import styles from './GameInfo.module.scss'
import classNames from 'classnames/bind'
import { IPlayer } from '../../types/player'
import { PlayerCard } from '../PlayerCard/PlayerCard'
import avatar1 from '../../assets/icons/avatar1.png'
import avatar2 from '../../assets/icons/avatar2.png'
import avatar3 from '../../assets/icons/avatar3.png'
import avatar4 from '../../assets/icons/avatar4.png'
import avatar5 from '../../assets/icons/avatar5.png'
import { IMe } from '../../pages/MainPage'

const cx = classNames.bind(styles)

interface IProps {
  me: IMe,
  players: IPlayer[]
}

const GameInfo: React.FC<IProps> = ({ me, players }) => {
  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5]

  return (
    <div className={cx('wrapper')}>
      {players.map((player, idx) => (
        <PlayerCard isMe={me.username === player.username} key={player.username} player={player} avatar={avatars[idx]} />
      ))}
    </div>
  )
}

export { GameInfo }
