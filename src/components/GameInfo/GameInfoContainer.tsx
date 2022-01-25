import React from 'react'
import { GameInfo } from './GameInfo'
import { IPlayer } from '../../types/player'

interface IProps {
  players: IPlayer[]
}

const GameInfoContainer: React.FC<IProps> = ({ players }) => {
  return (
    <aside>
      <GameInfo players={players} />
    </aside>
  )
}

export { GameInfoContainer }
