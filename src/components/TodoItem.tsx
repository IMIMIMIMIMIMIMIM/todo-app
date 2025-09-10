import type { Todo } from "../type";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <Box display="flex" alignItems="center" mb={0.5}>
      <Typography
        sx={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer",
          flex: 1,
        }}
        onClick={() => onToggle(todo.id)}
      >
        {todo.title}
      </Typography>
      <IconButton size="small" onClick={() => onDelete(todo.id)}>
        <DeleteIcon color="error" />
      </IconButton>
    </Box>
  );
}
