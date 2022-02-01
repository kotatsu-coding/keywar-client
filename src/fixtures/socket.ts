let EVENTS = {}

export const serverSocket = {
  emit: (event: string, ...args: any) => {
    EVENTS[event].forEach((handler: Function) => handler(...args))
  }
}

export const io = () => ({
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
  emit: jest.fn()
})

export const cleanUp = () => {
  EVENTS = {}
}