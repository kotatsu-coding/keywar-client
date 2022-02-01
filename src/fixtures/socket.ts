interface IEvents {
  [key: string]: Function[]
}

type IOn = (event: string, handler: Function) => void
type IOff = (event: string, handler: Function) => void
type IEmit = (event: string, ...args: any) => void

export interface IMockedClientSocket {
  on: IOn,
  off: IOff,
  emit: IEmit,
  close: () => void
}

export interface IMockedServerSocket {
  emit: IEmit
}

let EVENTS: IEvents = {}

export const serverSocket: IMockedServerSocket = {
  emit: (event: string, ...args: any) => {
    EVENTS[event].forEach((handler: Function) => handler(...args))
  }
}

export const clientSocket: IMockedClientSocket = {
  on: (event: string, handler: Function) => {
    if (event in EVENTS) {
      EVENTS[event].push(handler)
    } else {
      EVENTS[event] = [handler]
    }
  },
  off: (event: string, handlerToDelete: Function) => {
    if (event in EVENTS) {
      EVENTS[event] = EVENTS[event].filter(handler => handler !== handlerToDelete)
    }
  },
  emit: jest.fn(),
  close: jest.fn()
}

export const cleanUp = () => {
  EVENTS = {}
}