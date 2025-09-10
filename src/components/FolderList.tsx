import type { Folder } from "../type";
import FolderItem from "./FolderItem";

type Props = {
  folders: Folder[];
  currentFolderId: number | null;
  setCurrentFolderId: (id: number) => void;
  deleteFolder: (id: number) => void;
};

export default function FolderList({
  folders,
  currentFolderId,
  setCurrentFolderId,
  deleteFolder,
}: Props) {
  const renderChildren = (list: Folder[]) => (
    <>
      {list.map((f) => (
        <FolderItem
          key={f.id}
          folder={f}
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
          deleteFolder={deleteFolder}
          renderChildren={renderChildren}
        />
      ))}
    </>
  );

  return <>{folders.map((f) => renderChildren([f]))}</>;
}
