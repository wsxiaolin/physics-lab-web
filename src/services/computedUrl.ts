import getPath from "./getPath.ts";

type PUser = {
  ID: string;
  Avatar: number;
};

type PProjects = {
  ID: string;
  Image?: number;
};
export function getUserUrl(user: PUser): string {
  const url =
    user.Avatar === 0
      ? "/assets/user/default-avatar.png"
      : `/static/users/avatars/${user.ID.slice(0, 4)}/${user.ID.slice(4, 6)}/${user.ID.slice(
          6,
          8
        )}/${user.ID.slice(8, 24)}/${user.Avatar}.jpg`;

  return getPath(url);
}

export function getCoverUrl(data: PProjects): string {
  const url = `/static/experiments/images/${data.ID.slice(0, 4)}/${data.ID.slice(
    4,
    6
  )}/${data.ID.slice(6, 8)}/${data.ID.slice(8, 24)}/${data.Image || 0}.jpg!block`;
  console.log(url);
  return getPath(url);
}
