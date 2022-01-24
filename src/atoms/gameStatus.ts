import { atom } from 'recoil'

type TGameStatusState = 'idle' | 'playing' | 'finished'

export const gameStatusState = atom<TGameStatusState>({
  key: 'gameStatus',
  default: 'idle'
})