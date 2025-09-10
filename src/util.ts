import type { Folder } from "./type";

export const findFolderById = (
  id: number,
  folderList: Folder[]
): Folder | null => {
  for (let f of folderList) {
    if (f.id === id) return f;
    const found = findFolderById(id, f.folders);
    if (found) return found;
  }
  return null;
};

export const getPathNames = (
  folders: Folder[],
  currentFolderId: number | null
) => {
  if (currentFolderId === null) return [{ id: null, name: "메인" }];

  const path: { id: number; name: string }[] = [];

  const findPath = (folders: Folder[], targetId: number): boolean => {
    for (const f of folders) {
      if (f.id === targetId) {
        path.push({ id: f.id, name: f.name });
        return true;
      }
      if (findPath(f.folders, targetId)) {
        path.unshift({ id: f.id, name: f.name });
        return true;
      }
    }
    return false;
  };

  findPath(folders, currentFolderId);
  return [{ id: null, name: "메인" }, ...path];
};
