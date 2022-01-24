import { atom } from 'recoil'

interface ITeam {
  score: number,
  sequence: string[][],
  current_word: any,
  users: any[]
}
interface IGameInfo {
  teams: ITeam[]
}

export const gameInfoState = atom<IGameInfo>({
    key: 'gameInfo',
    default: {
      teams: [{ 
        score: 0,
        users: [],
        sequence: [],
        current_word: ''
      }, { 
        score: 0,
        users: [],
        sequence: [],
        current_word: ''
      }]
    }
})