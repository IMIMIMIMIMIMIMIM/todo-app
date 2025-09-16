import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Slide,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TodayIcon from "@mui/icons-material/Today";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";

type Props = {
  open: boolean;
  visible: boolean;
  onClose: () => void;
  onTodayClick: () => void;
  onWeekClick: () => void;
};

const Sidebar = ({
  open,
  visible,
  onClose,
  onTodayClick,
  onWeekClick,
}: Props) => {
  if (!visible) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
          }}
          onClick={onClose}
        />
      </Fade>

      {/* 사이드바 */}
      <Slide direction="right" in={open} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "60%",
            height: "100vh",
            bgcolor: "background.paper",
            boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1201,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 사이드바 헤더 */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              메뉴
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 사이드바 메뉴 */}
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Stack spacing={1}>
              <Button
                startIcon={<TodayIcon />}
                onClick={onTodayClick}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                오늘
              </Button>
              <Button
                startIcon={<CalendarViewWeekIcon />}
                onClick={onWeekClick}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                일주일
              </Button>
            </Stack>
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default Sidebar;
