import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

type Props = {
  type: "folder" | "todo";
  inputValue: string;
  setInputValue: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Modal({
  type,
  inputValue,
  setInputValue,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        {type === "folder" ? "폴더 이름 입력" : "할 일 입력"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={type === "folder" ? "폴더 이름" : "할 일"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onConfirm} variant="contained">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}
