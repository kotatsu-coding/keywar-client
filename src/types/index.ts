export interface IMe {
  id?: number,
  username: string,
  is_host: boolean,
  color?: string
}

export interface IUser {
  id: number,
  username: string,
  is_host: boolean,
  color: string
}

export interface IWord {
  value: string,
  colors: string[],
  current_idx: number,
  sequence: string[][]
}

export interface ITeam {
  current_word: IWord,
  score: number,
  users: IUser[]
}

export interface IRoom {
  id: number,
  users: IUser[],
  capacity: number
}

export enum EAudio {
  SUCCESS,
  FAILURE
}

export enum EGameStatus {
  IDLE,
  PLAYING,
  FINISHED
}