export const replaceBetween = (text, selection, what) =>
  text.substring(0, selection.start) + what + text.substring(selection.end);
