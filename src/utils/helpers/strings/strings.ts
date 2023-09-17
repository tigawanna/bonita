function isBlank(text: string) {
  if (text && text.length > 0) {
    return false;
  }
  return true;
}

export const strings = {
  isBlank,
};
