import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { AudioProvider } from './hooks/useAudio'
import { LobbyPage, RoomPage, EntrancePage } from './pages'
import { SocketManagerProvider } from './hooks/useSocket'

function App() {
  return (
    <SocketManagerProvider>
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
    </SocketManagerProvider>
  )
}

export default App
