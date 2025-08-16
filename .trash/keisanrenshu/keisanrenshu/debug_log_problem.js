export function debugLogProblem(problem) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('DEBUG: problem', problem);
  }
  return null;
}
