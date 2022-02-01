import { atom } from 'recoil'
import { IMe } from '../types'

export const meState = atom<IMe | null>({
  key: 'me',
  default: null
})