import { atom } from 'recoil'

interface IMe {
  id?: number,
  username: string,
  color?: string
}

export const meState = atom<IMe | null>({
  key: 'me',
  default: null
})