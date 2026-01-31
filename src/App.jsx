import './App.css'
import { Route, Routes, BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import Body from './components/Body'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Premium from './pages/Premium'
import MyRequests from './pages/MyRequests'
import PublicRoute from './utils/PublicRoute'
import { Provider } from 'react-redux'
import { appStore, persistor } from './utils/appStore'
import { PersistGate } from "redux-persist/integration/react"
import { useEffect } from 'react'
import MyConnections from './pages/MyConnections'
import Chat from './pages/Chat'


function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path='/' element={<Body />}>
        <Route path='login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='signup' element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path='feed' element={<Feed />} />
        <Route path='profile' element={<Profile />} />
        <Route path='premium' element={<Premium />} />
        <Route path='myRequests' element={<MyRequests />} />
        <Route path='myConnections' element={<MyConnections />} />
        <Route path='chat/:targetUserId' element={<Chat />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
