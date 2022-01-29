import { atom } from 'recoil'

interface IMe {
  id?: number,
  username: string,
  is_host: boolean,
  color?: string
}

export const meState = atom<IMe | null>({
  key: 'me',
  default: null
})