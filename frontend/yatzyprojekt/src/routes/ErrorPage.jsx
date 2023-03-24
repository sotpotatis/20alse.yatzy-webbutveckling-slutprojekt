/* ErrorPage.jsx
Sida som visas till exemple vid 404-fel. */
import {useRouteError} from "react-router-dom"
export default function ErrorPage() {
    const error = useRouteError() // Hämta felet som inträffade
    const errorDetails = error.statusText || error.message
    console.log("Ett fel relaterat till routing inträffade: ", error)
    let errorInfo = null
    // Rendera specifik text vid 404 Not Found, annars rendera en generisk feltext.
    if (error.status === 404) {
        errorInfo = <p>404 Not Found! Denna sida kunde inte hittas. Dubbelkolla länken och försök igen</p>
    }
    else {
        errorInfo = <p>Följande fel uppstod: {errorDetails}</p>
    }
    return <div id="error-page">
        <h1>Ojsan!</h1>
        {errorInfo}
    </div>
}