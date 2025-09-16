import type { Folder } from "../type";
import CategoryItem from "./CategoryItem";

type Props = {
  folders: Folder[];
  currentFolderId: number | null;
  setCurrentFolderId: (id: number) => void;
  deleteFolder: (id: number) => void;
};

const CategoryList = ({
  folders,
  currentFolderId,
  setCurrentFolderId,
  deleteFolder,
}: Props) => {
  const renderChildren = (list: Folder[]) => (
    <>
      {list.map((f) => (
        <CategoryItem
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
};

export default CategoryList;
