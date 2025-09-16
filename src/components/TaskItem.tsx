import type { Todo } from "../type";
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  Paper,
  Chip,
  Fade,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

const TaskItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <Fade in={true}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: todo.completed ? "action.hover" : "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
            sx={{
              color: "primary.main",
              "&.Mui-checked": {
                color: "success.main",
              },
            }}
          />

          <Box flex={1}>
            <Typography
              variant="body1"
              onClick={() => onToggle(todo.id)}
              sx={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "text.secondary" : "text.primary",
                fontWeight: todo.completed ? 400 : 500,
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              {todo.title}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {todo.completed && (
              <Chip
                label="완료"
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            )}

            <IconButton
              size="small"
              onClick={() => onDelete(todo.id)}
              sx={{
                color: "error.main",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default TaskItem;
