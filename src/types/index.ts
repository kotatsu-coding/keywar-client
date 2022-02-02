export interface IMe {
  id?: number,
  team_id?: number,
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
  id: number,
  users: IUser[]
}


export interface IRoom {
  id: number,
  teams: ITeam[],
  capacity: number
}

export interface IGameTeam extends ITeam {
  current_word: IWord,
  score: number
}

export interface IGame {
  gameStatus: EGameStatus,
  teams: IGameTeam[]
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