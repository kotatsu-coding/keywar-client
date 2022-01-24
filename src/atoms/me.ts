import { atom } from 'recoil'
import namer from 'korean-name-generator'

interface IMe {
  username: string,
  color: string
}

export const meState = atom<IMe>({
  key: 'me',
  default: {
    username: `${namer.generate(true)}`,
    color: ''
  }
})