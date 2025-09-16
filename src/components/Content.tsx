import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryList from "./CategoryList";
import TaskItem from "./TaskItem";
import type { Folder, Todo } from "../type";

type Props = {
  pathNames: Array<{ id: number | null; name: string }>;
  currentFolder: { folders: Folder[]; todos: Todo[] } | null;
  currentFolderId: number | null;
  onFolderClick: (id: number | null) => void;
  onTodoToggle: (id: number) => void;
  onTodoDelete: (id: number) => void;
  onFolderDelete: (id: number) => void;
};

const Content = ({
  pathNames,
  currentFolder,
  currentFolderId,
  onFolderClick,
  onTodoToggle,
  onTodoDelete,
  onFolderDelete,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 1,
        px: 1,
        width: "100%",
        minHeight: "calc(100vh - 56px)",
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
                  onClick={() => onFolderClick(p.id)}
                  variant={idx === pathNames.length - 1 ? "filled" : "outlined"}
                  color={idx === pathNames.length - 1 ? "primary" : "default"}
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
          {/* 카테고리 섹션 */}
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
                카테고리
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              {currentFolder &&
              currentFolder.folders &&
              currentFolder.folders.length > 0 ? (
                <CategoryList
                  folders={currentFolder.folders}
                  currentFolderId={currentFolderId}
                  setCurrentFolderId={onFolderClick}
                  deleteFolder={onFolderDelete}
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
                    카테고리가 없습니다
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
                <AssignmentIcon color="secondary" sx={{ fontSize: 20 }} />할 일
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              {currentFolder &&
              currentFolder.todos &&
              currentFolder.todos.length > 0 ? (
                <Box>
                  {currentFolder.todos.map((todo) => (
                    <TaskItem
                      key={todo.id}
                      todo={todo}
                      onToggle={onTodoToggle}
                      onDelete={onTodoDelete}
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
                  <AssignmentIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
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
  );
};

export default Content;
