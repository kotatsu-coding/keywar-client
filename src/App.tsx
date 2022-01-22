import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { GameRoom } from './components/Game/GameRoom'
import { MainPage } from './pages/MainPage'

function App() {
  return (
    <Router>
      <RecoilRoot>
        <Switch>
          <Route path='/' component={MainPage}></Route>
        </Switch>
      </RecoilRoot>
    </Router>
  )
}

export default App
