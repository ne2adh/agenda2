import React, { ReactElement, useEffect, useState } from "react";
import { IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableRow, useMediaQuery, Box, TableHead, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from "@mui/icons-material/Delete";
import ContenidoItem from "./ContenidoItem";
import { Add } from "@mui/icons-material";
import { v4 as uuidv4 } from 'uuid';

import io from "socket.io-client";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const socket = io(`${API_URL}`);

export interface TaskModel {
    id          : string;
    fecha      ?: string;  
    responsable : string;
    institucion : string;
    titulo      : string;
    hora        : string;
    lugar       : string;

    isEditing   : boolean;
    isNew      ?: boolean;
}

const MainStyle = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflow: "auto",
    padding: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

const MainStyle2 = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflow: "auto",
    [theme.breakpoints.up("lg")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

type Props = {
    currentDay: string;
    ContenidoCallBackData: (day: string, tasks: TaskModel[]) => void;
};

const Contenido = (props: Props): ReactElement => {
    const { currentDay, ContenidoCallBackData } = props;
    
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [error, setError] = useState(false);
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [newTask, setNewTask] = useState<TaskModel>({
        id         : uuidv4(),
        fecha      : currentDay,
        responsable: "",
        institucion: "",
        titulo     : "",
        hora       : "",
        lugar      : "",
        isEditing  : false,
        isNew      : false,
    });   

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TaskModel) => {
        setNewTask({ ...newTask, [field]: e.target.value });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof TaskModel) => {
        setTasks(tasks.map((task) => task.id === id ? { ...task, [field]: e.target.value } : task ));
    };

    const addTask = () => {
        setNewTask({
            id         : uuidv4(),
            fecha      : currentDay,
            responsable: "",
            institucion: "",
            titulo     : "",
            hora       : "",
            lugar      : "",
            isEditing  : false,
            isNew      : true,
        });
    };

    const saveNew = async () => {
        try {            
            const { data } = await axios.post(`${API_URL}/rows`, newTask);
            if (!data.success) {                
                console.error("Error :", data.message);
                setError(true)
            } else {  
                setError(false);              
                setTasks([...tasks, newTask]);
                currentDay && ContenidoCallBackData(currentDay, [...tasks, newTask]);
                setNewTask({
                    id         : uuidv4(),
                    fecha      : currentDay,
                    responsable: "",
                    institucion: "",
                    titulo     : "",
                    hora       : "",
                    lugar      : "",
                    isEditing  : false,
                    isNew      : false,
                });
            }
        }
        catch (error) {
            console.error("Error al guardar la tarea:", error);
        }
    }

    const cancelNew = () => {
        setNewTask({
            id         : uuidv4(),
            fecha      : currentDay,
            responsable: "",
            institucion: "",
            titulo     : "",
            hora       : "",
            lugar      : "",
            isEditing  : false,
            isNew      : false,
        })
    }

    const cancelEdit = (id: string) => {
        setTasks(tasks.map((task) => task.id === id ? { ...task, isEditing: false } : task));
    };


    const toggleEdit = (id: string) => {
        setTasks(tasks.map((task) => task.id === id ? { ...task, isEditing: !task.isEditing } : task));
    };

    const saveEdit = async (id: string) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, isEditing: false, isNew: false } : task
        );
    
        setTasks(updatedTasks);
        currentDay && ContenidoCallBackData(currentDay, updatedTasks);
    
        const taskToSave = updatedTasks.find(task => task.id === id);
        if (!taskToSave) return;
    
        try {
            const { data } = await axios.post(`${API_URL}/rows`, taskToSave);
            if (!data.success) {                
                console.error("Error :", data.message);
                setError(true)
            } else {
                setError(false)
            }
        } catch (error) {
            console.error("Error al guardar la tarea:", error);
        }
    };
    

    const deleteTask = async (id: string) => {
        if (id) {
            setTasks(tasks.filter((task) => task.id !== id));
            const { data } = await axios.delete(`${API_URL}/rows/${id}/${currentDay}`);
            if (data.success) {
                fetchRows(currentDay);
            } else {
              console.error("Error en Delete:", data.message);
            }
        }
    };

    const fetchRows = async (currentDay: string) => {
         try {
            const { data } = await axios.get(`${API_URL}/rows?fecha=${currentDay}`);
            if (data.success) {
              setTasks(data.data);
              currentDay && ContenidoCallBackData(currentDay, data.data);
            } else {
              console.error("Error en fetchRows:", data.message);
            }
          } catch (error) {
            console.error("Error al obtener tareas:", error);
        }
    };

    useEffect(() => {
        //if (!socket.connected) return; 
        fetchRows(currentDay);
        socket.on("update", fetchRows);
        return () => {
          socket.off("update", fetchRows);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDay]);
        
    if (isSmallScreen) {
        return (
        <MainStyle2>
            {tasks.map((task) => (
                <ContenidoItem
                    key={task.id}
                    task={task}
                    handleEditChange={handleEditChange}
                    toggleEdit={toggleEdit}
                    saveEdit={saveEdit}
                    deleteTask={deleteTask}
                />
            ))}
            <Box display="flex" justifyContent="center" mt={2}>
                <IconButton onClick={addTask} color="success">
                    <Add />
                </IconButton>
            </Box>
        </MainStyle2>
        );
    }

    return (
        <MainStyle>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{"&:hover .add-button": { opacity: 1, transition: "opacity 0.3s ease-in-out" }}}>
                            <TableCell sx={{borderBottom: "none"}}>
                                <IconButton
                                    onClick={addTask}
                                    color="success"
                                    className="add-button"
                                    sx={{ opacity: 0 }}
                                >
                                    <AddCircleIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell><Typography variant="subtitle2"><b>RESPONSABLE</b></Typography></TableCell>
                            <TableCell><b>INSTITUCIÓN</b></TableCell>
                            <TableCell><b>TÍTULO</b></TableCell>
                            <TableCell><b>HORA</b></TableCell>
                            <TableCell><b>LUGAR</b></TableCell>
                            <TableCell sx={{borderBottom: "none"}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow 
                                key={task.id}
                                sx={{
                                    "&:hover .delete-button": { opacity: 1, transition: "opacity 0.3s ease-in-out" },
                                    "&:hover .edit-button": { opacity: 1, transition: "opacity 0.3s ease-in-out" },
                                }}
                            >
                                <TableCell sx={{ alignContent: 'end', width: "1%", borderBottom: "none" }}>
                                    {task.isEditing ? (
                                        <>
                                            <IconButton onClick={() => saveEdit(task.id)} color="secondary">
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton onClick={() => cancelEdit(task.id)} color="error">
                                                <CancelIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton 
                                            onClick={() => toggleEdit(task.id)} 
                                            color="primary"
                                            className="edit-button"
                                            sx={{ opacity: 0 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "20%" }}>
                                    {task.isEditing ? (
                                        <TextField
                                            value={task.responsable}
                                            onChange={(e: any) =>
                                                handleEditChange(e, task.id, "responsable")
                                            }
                                            variant="standard"
                                            fullWidth
                                        />
                                    ) : (
                                        task.responsable
                                    )}
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "23%" }}>
                                    {task.isEditing ? (
                                        <TextField
                                        value={task.institucion}
                                        onChange={(e: any) =>
                                            handleEditChange(e, task.id, "institucion")
                                        }
                                        variant="standard"
                                        fullWidth
                                        />
                                    ) : (
                                        task.institucion
                                    )}
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "32%" }}>
                                    {task.isEditing ? (
                                        <TextField
                                            value={task.titulo}
                                            onChange={(e: any) =>
                                                handleEditChange(e, task.id, "titulo")
                                            }
                                            multiline
                                            rows={4}
                                            variant="standard"
                                            fullWidth
                                        />
                                    ) : (
                                        task.titulo
                                    )}
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "8%" }}>
                                    {task.isEditing ? (
                                        <TextField
                                            value={task.hora.substring(0, 5)}
                                            onChange={(e: any) =>
                                                handleEditChange(e, task.id, "hora")
                                            }
                                            variant="standard"
                                            fullWidth
                                            error={!!task.hora && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(task.hora.substring(0, 5))}
                                            helperText={!!task.hora && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(task.hora.substring(0, 5)) ? "Formato inválido (HH:mm)" : ""}
                                        />
                                    ) : (
                                        task.hora.substring(0, 5)
                                    )}
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "15%" }}>
                                    {task.isEditing ? (
                                        <TextField
                                            value={task.lugar}
                                            onChange={(e: any) =>
                                                handleEditChange(e, task.id, "lugar")
                                            }
                                            multiline
                                            rows={2}
                                            variant="standard"
                                            fullWidth
                                        />
                                    ) : (
                                        task.lugar
                                    )}
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "1%", borderBottom: "none" }}>
                                    <IconButton onClick={() => deleteTask(task.id)} color="error" className="delete-button" sx={{ opacity: 0 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>                
                {newTask.isNew && (
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ alignContent: 'end', width: "1%", borderBottom: "none" }}>
                                        <IconButton 
                                            onClick={() => saveNew()} 
                                            color="secondary"
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "20%", borderBottom: "none" }}>
                                    <TextField
                                        placeholder="Responsable"
                                        value={newTask.responsable}
                                        onChange={(e: any) => handleChange(e, "responsable")}
                                        variant="standard"
                                        fullWidth
                                        error={error}
                                        helperText={error ? "Este campo es requerido" : ""}
                                    />
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "15%", borderBottom: "none" }}>
                                    <TextField
                                        placeholder="Institución"
                                        value={newTask.institucion}
                                        onChange={(e: any) => handleChange(e, "institucion")}
                                        variant="standard"
                                        fullWidth
                                        error={error}
                                        helperText={error ? "Este campo es requerido" : ""}
                                    />
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "32%", borderBottom: "none" }}>
                                    <TextField
                                        placeholder="Título"
                                        value={newTask.titulo}
                                        onChange={(e: any) => handleChange(e, "titulo")}
                                        multiline
                                        rows={3}
                                        variant="standard"
                                        fullWidth
                                        error={error}
                                        helperText={error ? "Este campo es requerido" : ""}
                                    />
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "8%", borderBottom: "none" }}>
                                    <TextField
                                        placeholder="Hora"
                                        value={newTask.hora}
                                        onChange={(e: any) => handleChange(e, "hora")}
                                        variant="standard"
                                        fullWidth
                                        error={error && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(newTask.hora)}
                                        helperText={error && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(newTask.hora) ? "Formato inválido (HH:mm)" : ""}
                                    />
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "15%", borderBottom: "none" }}>
                                    <TextField
                                        placeholder="Lugar"
                                        value={newTask.lugar}
                                        onChange={(e: any) => handleChange(e, "lugar")}
                                        variant="standard"
                                        multiline
                                        rows={2}
                                        fullWidth
                                        error={error}
                                        helperText={error ? "Este campo es requerido" : ""}
                                    />
                                </TableCell>
                                <TableCell sx={{ alignContent: 'end', width: "1%", borderBottom: "none"}}>
                                        <IconButton 
                                            onClick={() => cancelNew()} 
                                            color="error"
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </MainStyle>
    );
};

export default Contenido;
