import { useState } from "react";
import type { Folder } from "../type";
import { IconButton, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type Props = {
  folder: Folder;
  currentFolderId: number | null;
  setCurrentFolderId: (id: number) => void;
  deleteFolder: (id: number) => void;
  renderChildren: (folders: Folder[]) => React.ReactElement;
};

const CategoryItem = ({
  folder,
  currentFolderId,
  setCurrentFolderId,
  deleteFolder,
  renderChildren,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box mb={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          size="small"
          onClick={() => folder.folders.length > 0 && setIsOpen(!isOpen)}
          sx={{
            opacity: folder.folders.length > 0 ? 1 : 0,
            cursor: folder.folders.length > 0 ? "pointer" : "default",
          }}
        >
          {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Typography
          onClick={() => setCurrentFolderId(folder.id)}
          sx={{
            cursor: "pointer",
            fontWeight: currentFolderId === folder.id ? "bold" : "normal",
            flexGrow: 1,
          }}
        >
          {folder.name}
        </Typography>
        <IconButton size="small" onClick={() => deleteFolder(folder.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>

      {isOpen && folder.folders.length > 0 && (
        <Box ml={2} mt={1}>
          {renderChildren(folder.folders)}
        </Box>
      )}
    </Box>
  );
};

export default CategoryItem;
