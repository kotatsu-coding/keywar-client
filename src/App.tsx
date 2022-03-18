import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AudioProvider } from './hooks/useAudio'
import { MeProvider } from './hooks/useMe'
import { LobbyPage, EntrancePage } from './pages'
import { SocketManagerProvider } from './hooks/useSocket'

function App() {
  return (
    <SocketManagerProvider>
      <Router>
        <MeProvider>
        <AudioProvider>
          <Switch>
            <Route exact path='/' component={EntrancePage} />
            <Route path='/lobby' component={LobbyPage} />
            {/* <Route path='/room/:roomId' component={RoomPage} /> */}
          </Switch>
        </AudioProvider>
        </MeProvider>
      </Router>
    </SocketManagerProvider>
  )
}

export default App
