import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TaskModel } from "./Contenido";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma español
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);
dayjs.locale("es");

export const ComponentToPrintContenido = React.forwardRef((props: any, ref: any) => {
    const DEFAULT_FORMAT = "dddd D [DE] MMMM [DE] YYYY"; 
    const fecha = dayjs(props.currentDay).format(DEFAULT_FORMAT).toUpperCase();
    const tasks: TaskModel[] = props.tasks || [];

    return (
        <Box ref={ref} sx={{ padding: "30px", textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", textDecoration: "underline" }}>
                AGENDA INSTITUCIONAL G.A.D.OR
            </Typography>
            <Typography variant="h6" sx={{ fontStyle: "italic", fontWeight: "bold", marginTop: "5px" }}>
                {`${fecha}`}
            </Typography>
            <TableContainer sx={{ marginTop: "20px", border: "1px solid black" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: '12px',fontWeight: "bold", border: "1px solid black" }}>NRO</TableCell>
                            <TableCell sx={{ fontSize: '12px',fontWeight: "bold", border: "1px solid black" }}>RESPONSABLE</TableCell>
                            <TableCell sx={{ fontSize: '12px',fontWeight: "bold", border: "1px solid black" }}>INSTITUCIÓN</TableCell>
                            <TableCell sx={{ fontSize: '12px',fontWeight: "bold", border: "1px solid black" }}>TÍTULO</TableCell>
                            <TableCell sx={{ fontSize: '12px',fontWeight: "bold", border: "1px solid black" }}>HORA</TableCell>
                            <TableCell sx={{ fontSize: '12px',fontWeight: "bold", border: "1px solid black" }}>LUGAR</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => (
                                <TableRow key={task.id}>
                                    <TableCell sx={{ border: "1px solid black" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ border: "1px solid black" }}>{task.responsable}</TableCell>
                                    <TableCell sx={{ border: "1px solid black" }}>{task.institucion}</TableCell>
                                    <TableCell sx={{ border: "1px solid black" }}>{task.titulo}</TableCell>
                                    <TableCell sx={{ border: "1px solid black" }}>{task.hora.substring(0, 5)}</TableCell>
                                    <TableCell sx={{ border: "1px solid black" }}>{task.lugar}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", border: "1px solid black" }}>
                                    No hay tareas disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
});
