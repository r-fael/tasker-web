export function handleText(value) {
  let new_value = value.replaceAll("- ", "• ");
  return new_value;
}
