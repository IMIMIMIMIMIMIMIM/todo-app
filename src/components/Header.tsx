import { AppBar, Toolbar, Box, Stack, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  onMenuClick: () => void;
  onFolderClick: () => void;
  onTodoClick: () => void;
};

const Header = ({ onMenuClick, onFolderClick, onTodoClick }: Props) => {
  return (
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
        <IconButton onClick={onMenuClick} sx={{ mr: 1, color: "text.primary" }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<FolderIcon sx={{ fontSize: 18 }} />}
            onClick={onFolderClick}
            size="small"
            sx={{
              fontSize: "0.8rem",
              px: 1.5,
              py: 0.5,
              minWidth: "auto",
              height: 32,
            }}
          >
            카테고리
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={onTodoClick}
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
  );
};

export default Header;
