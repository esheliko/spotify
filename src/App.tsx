import logo from './logo.svg';
import './App.css';
import { useEffect } from "react";
import { Auth } from './services/Auth';
import { setGlobalState, useGlobalState } from './globals';

function App() {
  const [user] = useGlobalState('user')

  useEffect(() => {
    Auth.signIn().then(user => {
      setGlobalState('user', user)
    })
  }, [])

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>{user?.email}</h1>
    </div>
  );
}

export default App;
