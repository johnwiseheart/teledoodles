export const makeId = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 4; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
