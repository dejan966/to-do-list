function getSafeError(error: unknown): { name: string } {
  let message;
  if (error instanceof Error) {
    message = error.message;
    return { name: message };
  } else if (typeof error === 'string') {
    message = error;
    return { name: message };
  } else {
    message = 'Something went wrong';
    return { name: message };
  }
}

export default getSafeError;
