export * from "./s3";

// tslint:disable:no-bitwise
export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // tslint:disable-next-line
    var r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
// tslint:enable:no-bitwise

export interface IPlayerInfo {
  avatarFileId: string;
  username: string;
  id: string;
}

export const getPlayerInfo = (): IPlayerInfo => {
  const playerInfo = localStorage.getItem("player");
  return playerInfo != null ? JSON.parse(playerInfo) : null;
};
