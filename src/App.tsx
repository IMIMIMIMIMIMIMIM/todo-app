import React, { useState, useEffect } from "react";
import type { Folder, Todo } from "./type";
import FolderList from "./components/FolderList";
import TodoItem from "./components/TodoItem";
import Modal from "./components/Modal";
import { getPathNames, findFolderById } from "./util";

import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  AppBar,
  Toolbar,
  Chip,
  Card,
  CardContent,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";

// 모던한 테마 생성
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
      // 메인 화면 - mainTodos에 할 일 추가
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
    // 메인 화면의 할 일 토글
    const mainTodo = mainTodos.find((t) => t.id === id);
    if (mainTodo) {
      setMainTodos(
        mainTodos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
      return;
    }

    // 폴더 내의 할 일 토글
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
    // 메인 화면의 할 일 찾기
    const mainTodo = mainTodos.find((t) => t.id === id);
    if (mainTodo) {
      setDeleteTarget({ type: "todo", id, name: mainTodo.title });
      setDeleteConfirmOpen(true);
      return;
    }

    // 폴더 내의 할 일 찾기
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
      // 메인 화면의 할 일 삭제
      const mainTodo = mainTodos.find((t) => t.id === deleteTarget.id);
      if (mainTodo) {
        setMainTodos(mainTodos.filter((t) => t.id !== deleteTarget.id));
      } else {
        // 폴더 내의 할 일 삭제
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
      // 폴더 삭제
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "667px",
          bgcolor: "background.default",
          width: "375px",
          margin: "0 auto",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* 상단 앱바 */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "white",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: 2 }}>
            <AssignmentIcon
              sx={{ mr: 1.5, color: "primary.main", fontSize: 24 }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<FolderIcon sx={{ fontSize: 18 }} />}
                onClick={() => setModalOpen("folder")}
                size="small"
                sx={{
                  fontSize: "0.8rem",
                  px: 1.5,
                  py: 0.5,
                  minWidth: "auto",
                  height: 32,
                }}
              >
                폴더
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => setModalOpen("todo")}
                size="small"
                color="secondary"
                sx={{
                  fontSize: "0.8rem",
                  px: 1.5,
                  py: 0.5,
                  minWidth: "auto",
                  height: 32,
                }}
              >
                할 일
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            py: 1,
            px: 1,
            width: "100%",
            height: "calc(667px - 56px)",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* 브레드크럼 */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 1.5,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  overflowX: "hidden",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {pathNames.map((p, idx) => (
                  <React.Fragment key={p.id ?? "main"}>
                    <Chip
                      icon={
                        p.name === "메인" ? (
                          <HomeIcon sx={{ fontSize: 16 }} />
                        ) : undefined
                      }
                      label={p.name === "메인" ? "홈" : p.name}
                      onClick={() => setCurrentFolderId(p.id)}
                      variant={
                        idx === pathNames.length - 1 ? "filled" : "outlined"
                      }
                      color={
                        idx === pathNames.length - 1 ? "primary" : "default"
                      }
                      size="small"
                      sx={{
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        height: 28,
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                        "&:hover": {
                          bgcolor:
                            idx === pathNames.length - 1
                              ? "primary.dark"
                              : "action.hover",
                        },
                      }}
                    />
                    {idx < pathNames.length - 1 && (
                      <Typography
                        sx={{
                          mx: 0.5,
                          color: "text.secondary",
                          fontSize: "0.8rem",
                        }}
                      >
                        &gt;
                      </Typography>
                    )}
                  </React.Fragment>
                ))}
              </Stack>
            </Paper>

            {/* 메인 컨텐츠 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* 폴더 섹션 */}
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  width: "100%",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    <FolderIcon color="primary" sx={{ fontSize: 20 }} />
                    폴더
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {currentFolder &&
                  currentFolder.folders &&
                  currentFolder.folders.length > 0 ? (
                    <FolderList
                      folders={currentFolder.folders}
                      currentFolderId={currentFolderId}
                      setCurrentFolderId={setCurrentFolderId}
                      deleteFolder={handleDeleteFolder}
                    />
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      <FolderIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        폴더가 없습니다
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* 할 일 섹션 */}
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  width: "100%",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    <AssignmentIcon color="secondary" sx={{ fontSize: 20 }} />할
                    일
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  {currentFolder &&
                  currentFolder.todos &&
                  currentFolder.todos.length > 0 ? (
                    <Box>
                      {currentFolder.todos.map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      <AssignmentIcon
                        sx={{ fontSize: 40, opacity: 0.3, mb: 1 }}
                      />
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        할 일이 없습니다
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {modalOpen && (
          <Modal
            type={modalOpen}
            inputValue={modalInput}
            setInputValue={setModalInput}
            onClose={() => setModalOpen(null)}
            onConfirm={modalOpen === "folder" ? addFolder : addTodo}
          />
        )}

        {/* 삭제 확인 다이얼로그 */}
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
                : `"${deleteTarget?.name}" 폴더를 삭제하시겠습니까? 폴더 안의 모든 내용이 함께 삭제됩니다.`}
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
      </Box>
    </ThemeProvider>
  );
}
