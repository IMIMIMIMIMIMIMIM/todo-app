import { useState, useEffect } from "react";
import type { Folder, Todo } from "./type";
import FolderList from "./components/FolderList";
import TodoItem from "./components/TodoItem";
import Modal from "./components/Modal";
import { getPathNames, findFolderById } from "./util";

import { Box, Button, Typography, Stack } from "@mui/material";

export default function App() {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const stored = localStorage.getItem("folders");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<"folder" | "todo" | null>(null);
  const [modalInput, setModalInput] = useState("");

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  const addFolder = () => {
    const newFolder: Folder = {
      id: Date.now(),
      name: modalInput,
      folders: [],
      todos: [],
    };
    if (currentFolderId === null) {
      setFolders([...folders, newFolder]);
    } else {
      const updateFolders = [...folders];
      const parent = findFolderById(currentFolderId, updateFolders);
      if (parent) parent.folders.push(newFolder);
      setFolders(updateFolders);
    }
    setModalInput("");
    setModalOpen(null);
  };

  const addTodo = () => {
    const newTodo: Todo = {
      id: Date.now(),
      title: modalInput,
      completed: false,
    };
    if (currentFolderId === null) {
      // 메인 화면 투두 관리 (폴더 없이)
      const mainFolder: Folder = {
        id: 0,
        name: "메인",
        folders: [],
        todos: [],
      };
      const existing = findFolderById(0, folders);
      if (existing) existing.todos.push(newTodo);
      else setFolders([...folders, mainFolder]);
    } else {
      const updateFolders = [...folders];
      const parent = findFolderById(currentFolderId, updateFolders);
      if (parent) parent.todos.push(newTodo);
      setFolders(updateFolders);
    }
    setModalInput("");
    setModalOpen(null);
  };

  const deleteFolder = (id: number) => {
    const removeFolder = (list: Folder[]): Folder[] =>
      list.filter((f) => {
        if (f.id === id) return false;
        f.folders = removeFolder(f.folders);
        return true;
      });
    setFolders(removeFolder(folders));
    if (currentFolderId === id) setCurrentFolderId(null);
  };

  const toggleTodo = (id: number) => {
    const toggleInFolder = (list: Folder[]) => {
      list.forEach((f) => {
        f.todos = f.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        toggleInFolder(f.folders);
      });
    };
    const newFolders = [...folders];
    toggleInFolder(newFolders);
    setFolders(newFolders);
  };

  const deleteTodo = (id: number) => {
    const deleteInFolder = (list: Folder[]) => {
      list.forEach((f) => {
        f.todos = f.todos.filter((t) => t.id !== id);
        deleteInFolder(f.folders);
      });
    };
    const newFolders = [...folders];
    deleteInFolder(newFolders);
    setFolders(newFolders);
  };

  const pathNames = getPathNames(folders, currentFolderId);

  const currentFolder =
    currentFolderId === null
      ? { folders, todos: [] }
      : findFolderById(currentFolderId, folders);

  return (
    <Box p={2}>
      {/* 경로 */}
      <Stack direction="row" spacing={1} mb={2}>
        {pathNames.map((p, idx) => (
          <Typography
            key={p.id ?? "main"}
            onClick={() => setCurrentFolderId(p.id)}
            sx={{
              cursor: "pointer",
              fontWeight: idx === pathNames.length - 1 ? "bold" : "normal",
            }}
          >
            {p.name}
            {idx < pathNames.length - 1 && " > "}
          </Typography>
        ))}
      </Stack>

      {/* 추가 버튼 */}
      <Stack direction="row" spacing={1} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen("folder")}
        >
          폴더 추가
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setModalOpen("todo")}
        >
          투두 추가
        </Button>
      </Stack>

      {/* 폴더 리스트 */}
      {currentFolder && currentFolder.folders && (
        <FolderList
          folders={currentFolder.folders}
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
          deleteFolder={deleteFolder}
        />
      )}

      {/* 투두 리스트 */}
      {currentFolder &&
        currentFolder.todos &&
        currentFolder.todos.length > 0 && (
          <Box mt={2}>
            {currentFolder.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </Box>
        )}

      {modalOpen && (
        <Modal
          type={modalOpen}
          inputValue={modalInput}
          setInputValue={setModalInput}
          onClose={() => setModalOpen(null)}
          onConfirm={modalOpen === "folder" ? addFolder : addTodo}
        />
      )}
    </Box>
  );
}
