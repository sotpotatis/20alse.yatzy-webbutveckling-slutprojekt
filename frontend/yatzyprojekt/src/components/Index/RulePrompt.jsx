import Button from "../Button"
import Container from "../Container"

/* RulePrompt.js
Frågar användaren om hen vill läsa reglerna i Yatzy eller inte. */
export default function RulePrompt(props) {
    const onClick = props.onClick
    return <Container
        title="Välkommen till Yatzy!"
        align="center"
        children={[
            <p>På denna hemsida kan du spela Yatzy själv (singleplayer) eller tillsammans med andra (multiplayer).</p>,
            <p>Innan vi börjar, <b>vill du läsa instruktioner om hur spelet går till?</b></p>,
            <Button color="blue" text="Ja tack!" additionalClasses="px-32" onClick={() => {onClick(true)} } />,
            <Button color="link" text="Nej, jag har koll." onClick={() => {onClick(false)} }/>
        ]}
    />
}