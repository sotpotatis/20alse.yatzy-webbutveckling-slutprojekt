/* ErrorContainer.jsx
Ett Container-element för att visa ett felmeddelande. */
import Container from "./Container";
export default function ErrorContainer({ message }) {
  return (
    <div className="h-screen w-screen flex align-center items-center justify-center content-center">
      <Container
        title="Fel"
        icon="material-symbols:warning-rounded"
        children={[<p>{message}</p>]}
      />
    </div>
  );
}
