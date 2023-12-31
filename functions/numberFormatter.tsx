export default function numberFunction(number: number) {
  const size = number.toString().length;

  // reserve 3 cells for points
  return size <= 2
    ? ["", ...(size === 1 ? [""] : []), ...number.toString().split("")]
    : number.toString().split("");
}
