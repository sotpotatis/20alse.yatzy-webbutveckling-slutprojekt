import Button from "../Button";
import Container from "../Container";

/* GameModePrompt.jsx
Frågar användaren om vilket spelläge de vill använda. */
export default function GameModePrompt(props) {
    return <Container title="Välj spelläge"
        classes={["w-1/3", "h-1/3", "flex", "flex-col", "items-center", "justify-evenly"]}
        children={[
            <Button color="lightGreen" text="1 spelare" icon="mdi:person-circle"/>,
            <Button color="lightBlue" text="Flera spelare" icon="material-symbols:group"/>,
        ]} />
}