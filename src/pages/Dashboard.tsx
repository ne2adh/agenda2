import React, { useEffect, useRef, useState } from "react";
// @mui
import { AppBar, Box, Container, IconButton, Popover, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import { useNavigate } from "react-router-dom";

import LogoutIcon from "@mui/icons-material/Logout";
import PrintIcon from "@mui/icons-material/Print";
import Calendario from "components/Calendario";
import Contenido, { TaskModel } from "components/Contenido";
import dayjs, { Dayjs } from "dayjs";

import { useReactToPrint } from "react-to-print";

// ----------------------------------------------------------------------
import io from "socket.io-client";
import axios from "axios";
import { ComponentToPrintContenido } from "components/ComponentToPrintContenido";
const API_URL = process.env.REACT_APP_API_URL;

// Configurar la conexión del socket con mejores opciones
const socket = io(API_URL, {
	transports: ["websocket"], // Evita polling y fuerza WebSocket
	reconnection: true, // Habilita la reconexión automática
	reconnectionAttempts: 5, // Intenta reconectar 5 veces antes de fallar
	reconnectionDelay: 2000, // Espera 2 segundos entre intentos
	timeout: 5000, // Tiempo máximo de espera para conexión
});

socket.on("connect", () => {
  	console.log("🔗 Conectado al WebSocket correctamente.");
});

socket.on("connect_error", (err) => {
  	console.error("❌ Error de conexión WebSocket:", err.message);
});

socket.on("disconnect", (reason) => {
  	console.warn("⚠️ Desconectado del WebSocket:", reason);
});

export interface Usuario {
	id: number;
	username: string;
	isEditing: boolean;
}

type AppBarProps = {
    onImprimirContenidoClick: () => void;
    usuarios?: Usuario[];
};
function CustomAppBar(props : AppBarProps) {    
    const { onImprimirContenidoClick, usuarios } = props;
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(dayjs());

    const [anchorElMonth, setAnchorElMonth] = useState<null | HTMLElement>(null);
    const [anchorElYear, setAnchorElYear] = useState<null | HTMLElement>(null);

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
      <Box sx={{ flexGrow: 1 }}>
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
        <AppBar position="static" color="error">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={()=> onImprimirContenidoClick()}
                >
                    <PrintIcon />
                </IconButton>
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
                {
                    !isSmallScreen?  
                        <Typography variant="subtitle1" display="flex" flexDirection="row">
                            Bienvenido, {localStorage.getItem("username")}!  <IconButton size="small" color="inherit" onClick={handleLogout}>
                                                                                <LogoutIcon />
                                                                            </IconButton>              
                        </Typography>
                    : 
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="logout"
                            onClick={()=> onImprimirContenidoClick()}
                        >
                            <LogoutIcon />
                        </IconButton>
                }
            </Toolbar>
        </AppBar>
      </Box>
    );
  }

export default function Dashboard() {
	const componentRecetaRef = useRef(null);

	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [currentDay, setCurrentDay] = useState<string>(dayjs().format("YYYY-MM-DD"));
	const [htmlContenidoOpen, setHTMLContenidoOpen] = useState<TaskModel[] | null>(null);

	const handleRecetaPrint = useReactToPrint({
		contentRef: componentRecetaRef,
		onBeforeGetContent: () => {},
		onAfterPrint: () => {
			//setHTMLContenidoOpen(null);
		},
	} as any);

	const handleClickCurrentDay = (currentDate: Dayjs) => {
		setCurrentDay(currentDate.format("YYYY-MM-DD"));
	};

	const fetchUsers = async () => {
		try {
            const { data } = await axios.get(`${API_URL}/usuarios`);
            if (data.success) {
                setUsuarios(data.data);
            } else {
                console.error("Error al obtener usuarios:", data.message);
            }
		} catch (error) {
		    console.error("Error en la solicitud de usuarios:", error);
		}
	};

	const handleImprimirContenidoClick = () => {
		handleRecetaPrint();
	};

	const handleContenidoCallBackData = (day: string, tasks: TaskModel[]) => {
		setHTMLContenidoOpen(tasks as TaskModel[]);
	};
	
	useEffect(() => {		 
		fetchUsers();	  
		socket.on("update_users", fetchUsers);
	  
		return () => {
		  socket.off("update_users", fetchUsers);
		};
	}, []);

    return (
        <>
            <CustomAppBar 
                usuarios={usuarios}
                onImprimirContenidoClick={handleImprimirContenidoClick}
            />
            <Container maxWidth="xl">
                {
                    <div style={{ overflow: "hidden", height: 0 }}>
                    <ComponentToPrintContenido
                        ref={componentRecetaRef}
                        tasks={htmlContenidoOpen}
                        currentDay={currentDay}
                    />
                    </div>
                }        
                <Calendario
                    onCurrentDayClick={handleClickCurrentDay}			
                />
                <Contenido
                    currentDay={currentDay}
                    ContenidoCallBackData={handleContenidoCallBackData}
                />
            </Container>
        </>
    );
}
