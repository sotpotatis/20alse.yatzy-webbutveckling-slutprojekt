/* InputField.js
En stylad input med en label. */
export default function InputField({
  type,
  value,
  placeholder,
  label,
  id,
  onChange,
  invalid,
  invalidExplanation,
}) {
  let elements = [
    <label className="font-bold mr-3" htmlFor={`${id}`}>
      {label}
    </label>,
  ];
  // Propen "valid" används för att göra det möjligt att lägga till en ruta som säger att inputen är ogiltig.
  let inputFieldExtraClasses = invalid === true ? "border-red-500" : "";
  elements.push(
    <input
      className={`px-3 py-1 rounded-lg border-2 border-gray-800 ${inputFieldExtraClasses}`}
      value={value}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
  // Propen "invalidExplanation" gör det även möjligt att lägga till ett felmeddelande som ska visas om inputen är ogiltig.
  if (invalid === true && invalidExplanation !== null) {
    elements.push(<p className="text-red-500 text-sm">{invalidExplanation}</p>);
  }
  return elements;
}
InputField.defaultProps = {
  invalid: false,
  invalidExplanation: null,
};
