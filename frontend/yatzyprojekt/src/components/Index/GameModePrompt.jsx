import Button from "../Button";
import Container from "../Container";

/* GameModePrompt.jsx
Frågar användaren om vilket spelläge de vill använda. */
export default function GameModePrompt(props) {
    return <Container title="Välj spelläge"
        children={[
            <Button color="lightGreen" text="1 spelare" icon="mdi:person-circle"/>,
            <Button color="lightBlue" text="Flera spelare" icon="material-symbols:group"/>,
        ]} />
}