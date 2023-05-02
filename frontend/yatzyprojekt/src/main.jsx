/* main.jsx
Denna fil "monterar" appen på hemsidan och renderar allt. */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import GameLobby from "./routes/GameLobby";
import Index from "./routes/Index";
import Root from "./routes/Root";
import Game from "./routes/GamePage.jsx";
import ErrorPage from "./routes/ErrorPage";
// Här defineras de olika undersidorna på hemsidan
const router = createBrowserRouter(
  [
    {
      // Startsida på hemsidan
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Index />,
        },
        {
          // Undersida för att ansluta till ett spel med flerspelarläge
          path: "/lobby",
          element: <GameLobby />,
        },
        {
          // Undersida för själva spelet
          path: "/game",
          element: <Game />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
