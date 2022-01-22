import { atom } from 'recoil'

export const socketState = atom<any>({
  key: 'socket',
  default: null,
})
