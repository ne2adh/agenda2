import React, { useEffect, useRef, useState } from "react";
// @mui
import { Container } from "@mui/material";
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

	const handleImprimirContenidoClick = (selectedDay: Dayjs) => {
		selectedDay && handleRecetaPrint();
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
			usuarios={usuarios}
			onImprimirContenidoClick={handleImprimirContenidoClick}
		/>
		<Contenido
			currentDay={currentDay}
			ContenidoCallBackData={handleContenidoCallBackData}
		/>
    </Container>
  );
}
