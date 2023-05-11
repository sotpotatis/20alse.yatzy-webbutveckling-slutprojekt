/* ErrorContainer.jsx
Ett Container-element för att visa ett felmeddelande. */
import Container from "./Container";
export default function ErrorContainer({ message, smallMessage }) {
  const smallMessageElement =
    smallMessage !== null
      ? []
      : [<span className="text-gray-700 text-sm">{smallMessage}</span>];
  return (
    <div className="h-screen w-screen flex align-center items-center justify-center content-center">
      <Container
        title="Fel"
        icon="material-symbols:warning-rounded"
        children={[<p>{message}</p>, ...smallMessageElement]}
      />
    </div>
  );
}
ErrorContainer.defaultProps = {
  smallMessage: null,
};
