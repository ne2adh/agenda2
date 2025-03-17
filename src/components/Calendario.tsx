import { ReactElement, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton } from "@mui/material";
import {ArrowBackIos, ArrowForwardIos} from '@mui/icons-material';

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const CalendarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //padding: theme.spacing(2),
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
};

const Calendario = (props: Props): ReactElement => {
    const { onCurrentDayClick } = props;

    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const today = dayjs().date();
    
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

    const handleDayClick = (day: Dayjs) => {
        setSelectedDay(day);
        onCurrentDayClick(day);
    };  

return (
    <CalendarContainer>        
        <WeekNavigation>
            <IconButton onClick={goToPreviousWeek} color="warning">
                <ArrowBackIos />
            </IconButton>
            <Box width="100%">
                <WeekDays>
                    {getWeekDays().map((day, index) => (
                    <Typography key={index} variant="body2" sx={{ fontWeight: "bold" }}>
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
