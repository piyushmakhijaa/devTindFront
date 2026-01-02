import './App.css'
import { Route,Routes, BrowserRouter } from 'react-router-dom'
import Body from './components/Body'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Feed from './pages/Feed'
import { Provider } from 'react-redux'
import {appStore, persistor} from './utils/appStore';
import { PersistGate } from "redux-persist/integration/react";
import Profile from './pages/Profile'
import PublicRoute from './utils/PublicRoute'
import MyRequests from './pages/MyRequests'

function App() {
  

  return (
<Provider store={appStore}>
  <PersistGate loading={null} persistor={persistor}>
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<Body />}>
                 <Route path={'/login'} element={ <PublicRoute>   <Login /> </PublicRoute> } />
                 <Route path='signup' element={<PublicRoute>  <SignUp />  </PublicRoute>} />
                 <Route path='feed' element={    <Feed />   } />
                 <Route path='profile' element={  <Profile />   } />
                 <Route path='myRequests' element={  <MyRequests/>   } />
        </Route>
      </Routes>
  </BrowserRouter>
  </PersistGate>
</Provider>

  )
}

export default App
