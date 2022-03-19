import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { IMe } from '../types'

interface IMeProvider {
  children: React.ReactNode
}

interface IMeContext {
  me: IMe | null,
  setMe: Dispatch<SetStateAction<null>>,
  enter: (username?: string) => void
}

const MeContext = createContext<IMeContext>({
  me: null,
  setMe: () => {},
  enter: () => {}
})

const MeProvider = ({ children }: IMeProvider) => {
  const [me, setMe] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem('keywar-token')
    if (token) {
      fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        return response.json()
      }).then(response => {
        const { user } = response
        sessionStorage.setItem('keywar-token', user.token)
        setMe(user)
      }).catch(error => {
        sessionStorage.removeItem('keywar-token')
        console.log(error)
        setMe(null)
      })
    } else {
      setMe(null)
    }
  }, [])

  const enter = (username?: string) => {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json()
    }).then(response => {
      const { user } = response
      sessionStorage.setItem('keywar-token', user.token)
      setMe(user)
    })
  }

  return (
    <MeContext.Provider value={{
      me,
      setMe,
      enter
    }}>
      { children }
    </MeContext.Provider>
  )  
}

const useMe = () => {
  const { me, enter, setMe } = useContext(MeContext)
  return { me, enter, setMe }
}

export { MeProvider, useMe }