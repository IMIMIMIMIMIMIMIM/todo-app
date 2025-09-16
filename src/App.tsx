import { useState, useEffect } from "react";
import type { Folder, Todo } from "./type";
import { getPathNames, findFolderById } from "./util";
import Header from "./components/Header";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";

import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
      light: "#a5b4fc",
      dark: "#4338ca",
    },
    secondary: {
      main: "#ec4899",
      light: "#f9a8d4",
      dark: "#be185d",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
  },
});

export default function App() {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const stored = localStorage.getItem("folders");
    return stored ? JSON.parse(stored) : [];
  });

  const [mainTodos, setMainTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem("mainTodos");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<"folder" | "todo" | null>(null);
  const [modalInput, setModalInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "todo" | "folder";
    id: number;
    name: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("mainTodos", JSON.stringify(mainTodos));
  }, [mainTodos]);

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
      setMainTodos([...mainTodos, newTodo]);
    } else {
      const updateFolders = [...folders];
      const parent = findFolderById(currentFolderId, updateFolders);
      if (parent) parent.todos.push(newTodo);
      setFolders(updateFolders);
    }
    setModalInput("");
    setModalOpen(null);
  };

  const toggleTodo = (id: number) => {
    const mainTodo = mainTodos.find((t) => t.id === id);
    if (mainTodo) {
      setMainTodos(
        mainTodos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
      return;
    }

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

  const handleDeleteTodo = (id: number) => {
    const mainTodo = mainTodos.find((t) => t.id === id);
    if (mainTodo) {
      setDeleteTarget({ type: "todo", id, name: mainTodo.title });
      setDeleteConfirmOpen(true);
      return;
    }

    const findTodoInFolder = (
      list: Folder[]
    ): { todo: Todo; folderName: string } | null => {
      for (const f of list) {
        const todo = f.todos.find((t) => t.id === id);
        if (todo) return { todo, folderName: f.name };
        const found = findTodoInFolder(f.folders);
        if (found) return found;
      }
      return null;
    };

    const found = findTodoInFolder(folders);
    if (found) {
      setDeleteTarget({ type: "todo", id, name: found.todo.title });
      setDeleteConfirmOpen(true);
    }
  };

  const handleDeleteFolder = (id: number) => {
    const findFolderInList = (list: Folder[]): Folder | null => {
      for (const f of list) {
        if (f.id === id) return f;
        const found = findFolderInList(f.folders);
        if (found) return found;
      }
      return null;
    };

    const folder = findFolderInList(folders);
    if (folder) {
      setDeleteTarget({ type: "folder", id, name: folder.name });
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "todo") {
      const mainTodo = mainTodos.find((t) => t.id === deleteTarget.id);
      if (mainTodo) {
        setMainTodos(mainTodos.filter((t) => t.id !== deleteTarget.id));
      } else {
        const deleteInFolder = (list: Folder[]) => {
          list.forEach((f) => {
            f.todos = f.todos.filter((t) => t.id !== deleteTarget.id);
            deleteInFolder(f.folders);
          });
        };
        const newFolders = [...folders];
        deleteInFolder(newFolders);
        setFolders(newFolders);
      }
    } else {
      const removeFolder = (list: Folder[]): Folder[] =>
        list.filter((f) => {
          if (f.id === deleteTarget.id) return false;
          f.folders = removeFolder(f.folders);
          return true;
        });
      setFolders(removeFolder(folders));
      if (currentFolderId === deleteTarget.id) setCurrentFolderId(null);
    }

    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const pathNames = getPathNames(folders, currentFolderId);
  const currentFolder =
    currentFolderId === null
      ? { folders, todos: mainTodos }
      : findFolderById(currentFolderId, folders);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setTimeout(() => setSidebarVisible(false), 300);
  };

  const handleTodayClick = () => {
    setCurrentFolderId(null);
    handleSidebarClose();
  };

  const handleWeekClick = () => {
    // 일주일 기능 구현 예정
    handleSidebarClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          width: "375px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Header
          onMenuClick={() => {
            setSidebarVisible(true);
            setSidebarOpen(true);
          }}
          onFolderClick={() => setModalOpen("folder")}
          onTodoClick={() => setModalOpen("todo")}
        />

        <Content
          pathNames={pathNames}
          currentFolder={currentFolder}
          currentFolderId={currentFolderId}
          onFolderClick={setCurrentFolderId}
          onTodoToggle={toggleTodo}
          onTodoDelete={handleDeleteTodo}
          onFolderDelete={handleDeleteFolder}
        />

        {modalOpen && (
          <Modal
            type={modalOpen}
            inputValue={modalInput}
            setInputValue={setModalInput}
            onClose={() => setModalOpen(null)}
            onConfirm={modalOpen === "folder" ? addFolder : addTodo}
          />
        )}

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "error.main",
            }}
          >
            <AssignmentIcon />
            삭제 확인
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {deleteTarget?.type === "todo"
                ? `"${deleteTarget.name}" 할 일을 삭제하시겠습니까?`
                : `"${deleteTarget?.name}" 카테고리를 삭제하시겠습니까? 카테고리 안의 모든 내용이 함께 삭제됩니다.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              variant="outlined"
              sx={{ minWidth: 80 }}
            >
              취소
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              sx={{ minWidth: 80 }}
            >
              삭제
            </Button>
          </DialogActions>
        </Dialog>

        <Sidebar
          open={sidebarOpen}
          visible={sidebarVisible}
          onClose={handleSidebarClose}
          onTodayClick={handleTodayClick}
          onWeekClick={handleWeekClick}
        />
      </Box>
    </ThemeProvider>
  );
}
