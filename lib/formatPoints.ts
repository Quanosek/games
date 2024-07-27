export default function FormatPoints(value: string | number) {
  value = Number(value);

  const size = value.toString().length;
  const newValue = value.toString().split("");
  return size <= 2 ? ["", ...(size === 1 ? [""] : []), ...newValue] : newValue;
}
