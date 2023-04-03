/* main.jsx
Denna fil "monterar" appen på hemsidan och renderar allt. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import GameLobby from './routes/GameLobby'
import Index from './routes/Index'
import Root from "./routes/Root"
import Game from './routes/Game'
import ErrorPage from './routes/ErrorPage'
// Här defineras de olika undersidorna på hemsidan
const router = createBrowserRouter([{ // Startsida på hemsidan
  path: "/yatzy",
  element: <Root />,
  errorElement: <ErrorPage/>,
  children: [
    {
    path: "/yatzy",
    element: <Index/>
  },
  { // Undersida för att ansluta till ett spel med flerspelarläge
  path: "/yatzy/join-game",
    element: <GameLobby/>
  },
{ // Undersida för själva spelet
  path: "/yatzy/game/:id",
  element: <Game/>  
}
  ]
}
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
