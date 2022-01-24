import React from 'react'
import { GameInfo } from './GameInfo'
import { IPlayer } from '../../types/player'
import { IMe } from '../../pages/MainPage'

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
