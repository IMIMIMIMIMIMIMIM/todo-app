import { useState } from "react";
import type { Folder } from "../type";
import TodoItem from "./TodoItem";
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

export default function FolderItem({
  folder,
  currentFolderId,
  setCurrentFolderId,
  deleteFolder,
  renderChildren,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box mb={1} ml={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          {folder.todos.length > 0 && (
            <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
          <Typography
            onClick={() => setCurrentFolderId(folder.id)}
            sx={{
              cursor: "pointer",
              fontWeight: currentFolderId === folder.id ? "bold" : "normal",
            }}
          >
            {folder.name}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => deleteFolder(folder.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>

      {isOpen && folder.todos.length > 0 && (
        <Box ml={4} mt={1}>
          {folder.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => {}}
              onDelete={() => {}}
            />
          ))}
        </Box>
      )}

      {folder.folders.length > 0 && renderChildren(folder.folders)}
    </Box>
  );
}
