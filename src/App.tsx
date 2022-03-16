import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { AudioProvider } from './hooks/useAudio'
import { LobbyPage, RoomPage, EntrancePage } from './pages'
import { manager } from './manager'

function App() {
  useEffect(() => {
    const socket = manager.socket('/')
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <Router>
      <RecoilRoot>
        <AudioProvider>
          <Switch>
            <Route exact path='/' component={EntrancePage} />
            <Route path='/lobby' component={LobbyPage} />
            <Route path='/room/:roomId' component={RoomPage} />
          </Switch>
        </AudioProvider>
      </RecoilRoot>
    </Router>
  )
}

export default App
