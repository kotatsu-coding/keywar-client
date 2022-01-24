import React from 'react'
import { GameInfo } from './GameInfo'
import { IPlayer } from '../../types/player'
import { IMe } from '../../pages/MainPage'

interface IProps {
  me: IMe,
  players: IPlayer[]
}

const GameInfoContainer: React.FC<IProps> = ({ me, players }) => {
  return (
    <aside>
      <GameInfo me={me} players={players} />
    </aside>
  )
}

export { GameInfoContainer }
