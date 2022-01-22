import React from 'react'
import styles from './GameInfoContainer.module.scss'
import classNames from 'classnames/bind'
import { GameInfo } from './GameInfo'
import { getPlayers } from '../../fixtures/players'
import { player } from '../../types/player'

const cx = classNames.bind(styles)
interface IProps {
  players: Array<player>
}

const GameInfoContainer: React.FC<IProps> = ({ players }) => {
  return (
    <aside>
      <GameInfo players={players} />
    </aside>
  )
}

export { GameInfoContainer }
