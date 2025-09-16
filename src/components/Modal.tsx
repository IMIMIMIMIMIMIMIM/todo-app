import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";

type Props = {
  type: "folder" | "todo";
  inputValue: string;
  setInputValue: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

const Modal = ({
  type,
  inputValue,
  setInputValue,
  onClose,
  onConfirm,
}: Props) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue.trim()) {
      onConfirm();
    }
  };
  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
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
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {type === "folder" ? (
            <FolderIcon color="primary" />
          ) : (
            <AssignmentIcon color="secondary" />
          )}
          <Typography variant="h6" fontWeight={600}>
            {type === "folder" ? "새 카테고리 만들기" : "새 할 일 추가"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            type === "folder"
              ? "카테고리 이름을 입력하세요"
              : "할 일을 입력하세요"
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 80 }}>
          취소
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={type === "folder" ? "primary" : "secondary"}
          disabled={!inputValue.trim()}
          sx={{ minWidth: 80 }}
        >
          {type === "folder" ? "만들기" : "추가"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
