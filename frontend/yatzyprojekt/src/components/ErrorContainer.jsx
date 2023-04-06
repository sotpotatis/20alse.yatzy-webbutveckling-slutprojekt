/* ErrorContainer.jsx
Ett Container-element för att visa ett felmeddelande. */
import Container from "./Container"
export default function ErrorContainer({message}){
    return <Container title="Fel" icon="material-symbols:warning-rounded" children={
        [
            <p>{message}</p>
        ]
    } />
}