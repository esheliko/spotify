import logo from './logo.svg';
import './App.css';
import { useEffect } from "react";
import { Auth } from './services/Auth';
import { setGlobalState, useGlobalState } from './globals';
import { useModifier } from './hooks';

function App() {
  const [user, setUser] = useGlobalState('user')
  const [_, modifyUser] = useModifier(user,
    {
      resetLogins: { emailVerified: true },
      login: ({ emailVerified }, email: string, uid: string) => ({ email: email ?? '', uid: uid ?? '', logins: emailVerified }),
      reLogin: ({ emailVerified }) => ({ emailVerified: emailVerified }),
      logout: ({ email, emailVerified }) => ({ email: undefined, uid: undefined, logins: 0 })
    }, setUser)

  modifyUser('login', '', '')
  modifyUser('resetLogins')
  modifyUser('set', { email: '', uid: '' })
  modifyUser('clear')

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
