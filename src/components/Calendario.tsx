import { ReactElement, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton, Popover, Button } from "@mui/material";
import {ArrowBackIos, ArrowForwardIos} from '@mui/icons-material';
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import { Avatar, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PrintIcon from "@mui/icons-material/Print";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import { Usuario } from "pages/Dashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

dayjs.locale("es");

const API_URL = process.env.REACT_APP_API_URL;

const CalendarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
}));

const WeekNavigation = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 800,
});

const WeekDays = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 800,
    marginBottom: 8,
    transition: "transform 0.3s ease-in-out",
});

const DaysRow = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 800,
    transition: "transform 0.3s ease-in-out",
});

const Day = styled(Typography, {
    shouldForwardProp: (prop) => prop !== "selected" && prop !== "highlighted",
})<{ selected?: boolean; highlighted?: boolean }>(
    ({ theme, selected, highlighted }) => ({
        width: 42,
        height: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        cursor: "pointer",
        border: highlighted ? "2px solid blue" : selected ? "2px solid green" : "none",
        fontWeight: selected || highlighted ? "bold" : "normal",
        transition: "0.3s",
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    })
);

type Props = {
    onCurrentDayClick: (currentDate: Dayjs) => void;
    onImprimirContenidoClick: (selectedDay: Dayjs) => void;
    usuarios: Usuario[];
};

const Calendario = (props: Props): ReactElement => {
    const { onCurrentDayClick, onImprimirContenidoClick, usuarios } = props;
    const navigate = useNavigate();

    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const today = dayjs().date();
    const [anchorElMonth, setAnchorElMonth] = useState<null | HTMLElement>(null);
    const [anchorElYear, setAnchorElYear] = useState<null | HTMLElement>(null);

    const getWeekDays = () => ["LUN.","MAR.","MIE.","JUE.","VIE.","SAB.","DOM.",];

    const getWeekDaysNumbers = () => {
        const startOfWeek = currentDate.startOf("week");
        return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    };

    const goToPreviousWeek = () => {
        setCurrentDate((prev) => prev.subtract(1, "week"));
    };

    const goToNextWeek = () => {
        setCurrentDate((prev) => prev.add(1, "week"));
    };

    const handleMonthClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMonth(event.currentTarget);
    };

    const handleYearClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElYear(event.currentTarget);
    };

    const handleCloseMonth = () => {
        setAnchorElMonth(null);
    };

    const handleCloseYear = () => {
        setAnchorElYear(null);
    };

    const handleMonthChange = (newMonth: Dayjs) => {
        setCurrentDate(currentDate.month(newMonth.month())); 
        handleCloseMonth();
    };

    const handleYearChange = (newYear: Dayjs) => {
        setCurrentDate(currentDate.year(newYear.year()));
        handleCloseYear();
    };

    const handleDayClick = (day: Dayjs) => {
        setSelectedDay(day);
        onCurrentDayClick(day);
    };

    const handleLogout = async () => {
        try {
            const username = localStorage.getItem("username");
            const { data } = await axios.post(`${API_URL}/logout`, { username });
            if (data.success) {
                localStorage.removeItem("username");
                navigate("/");
            } else {
                console.error("Error al obtener logout:", data.message);
            }            
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
    };

return (
    <CalendarContainer>
        <Box display="flex" alignItems="center" gap={1} position="absolute" top={10} right={20}>
            {usuarios.map((u) => (
                <Tooltip key={u.id} title={u.username}>
                    <Avatar sx={{ bgcolor: u.isEditing ? "green" : "gray", height: 24, width: 24, fontSize: 12 }}>
                        {u.username[0].toUpperCase()}
                    </Avatar>
                </Tooltip>
            ))}
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-start" position="absolute" top={10} left={20}>
            <Typography variant="subtitle1">
                Bienvenido, {localStorage.getItem("username")}!  <IconButton size="small" color="secondary" onClick={handleLogout}>
                                                                    <LogoutIcon />
                                                                </IconButton>              
            </Typography>            
            <Button 
                size="small" 
                color="info" 
                variant="contained" 
                onClick={()=> selectedDay && onImprimirContenidoClick(selectedDay)} 
                sx={{ mt: 1 }} 
                disabled={!selectedDay}
            >
                <PrintIcon /> Imprimir
            </Button>
        </Box>
        <Box width="100%" display="flex" justifyContent="space-evenly">
            <Typography
                variant="h6"
                fontWeight="bold"
                onClick={handleMonthClick}
                style={{ cursor: "pointer" }}
            >
                {currentDate.format("MMMM").toUpperCase()}
            </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                onClick={handleYearClick}
                style={{ cursor: "pointer" }}
            >
                {currentDate.format("YYYY").toUpperCase()}
            </Typography>
        </Box>
        <Popover
            open={Boolean(anchorElMonth)}
            anchorEl={anchorElMonth}
            onClose={handleCloseMonth}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            disableAutoFocus
            disableEnforceFocus
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: 300, p: 1 }}>
                    <MonthCalendar value={currentDate} onChange={handleMonthChange} />
                </Box>
            </LocalizationProvider>
        </Popover>
        <Popover
            open={Boolean(anchorElYear)}
            anchorEl={anchorElYear}
            onClose={handleCloseYear}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            disableAutoFocus
            disableEnforceFocus
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: 300, p: 1 }}>
                    <YearCalendar value={currentDate} onChange={handleYearChange} />
                </Box>
            </LocalizationProvider>
        </Popover>
        <WeekNavigation>
            <IconButton onClick={goToPreviousWeek} color="warning">
                <ArrowBackIos />
            </IconButton>
            <Box width="100%">
                <WeekDays>
                    {getWeekDays().map((day, index) => (
                    <Typography key={index} variant="body2">
                        {day}
                    </Typography>
                    ))}
                </WeekDays>
                <DaysRow>
                    {getWeekDaysNumbers().map((day, index) => (
                        <Day
                            key={index}
                            selected={day.date() === today && day.isSame(dayjs(), "month")}
                            highlighted={selectedDay?.isSame(day, "day")}
                            onClick={() => handleDayClick(day)}
                        >
                            {day.date()}
                        </Day>
                    ))}
                </DaysRow>
            </Box>
            <IconButton onClick={goToNextWeek} color="warning">
                <ArrowForwardIos />
            </IconButton>
        </WeekNavigation>
    </CalendarContainer>
    );
};

export default Calendario;
