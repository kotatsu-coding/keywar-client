import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { AudioProvider } from './hooks/useAudio'
import { LobbyPage, RoomPage } from './pages'

function App() {
  return (
    <Router>
      <RecoilRoot>
        <AudioProvider>
          <Switch>
            <Route exact path='/' component={LobbyPage} />
            <Route path='/room/:roomId' component={RoomPage} />
          </Switch>
        </AudioProvider>
      </RecoilRoot>
    </Router>
  )
}

export default App
