/* ErrorPage.jsx
Sida som visas till exemple vid 404-fel. */
import { useRouteError } from "react-router-dom";
import ErrorContainer from "../components/ErrorContainer";
export default function ErrorPage() {
  const error = useRouteError(); // Hämta felet som inträffade
  const errorDetails = error.statusText || error.message;
  console.log("Ett fel inträffade: ", error);
  let errorMessage = null;
  // Rendera specifik text vid 404 Not Found, annars rendera en generisk feltext.
  if (error.status === 404) {
    errorMessage =
      "404 Not Found! Denna sida kunde inte hittas. Dubbelkolla länken och försök igen.";
  } else {
    errorMessage = `Ett internt fel uppstod på hemsidan. Följande fel uppstod: ${errorDetails}. Detta är inget du kan göra något åt utan det är troligtvis fel i min kod.
        Jag ber om ursäkt. Återkom lite senare.`;
  }
  return (
    <div id="error-page">
      <ErrorContainer message={errorMessage} />
    </div>
  );
}
