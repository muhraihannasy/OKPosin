export function generateSequentialCode(
  number: number,
  prefix = 'PB',
  length = 6,
): string {
  return `${prefix}-${String(number).padStart(length, '0')}`;
}
