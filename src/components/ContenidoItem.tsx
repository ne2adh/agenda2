import React from "react";
import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Save, Delete } from "@mui/icons-material";
import { TaskModel } from "./Contenido";

interface ContenidoItemProps {
    task            : TaskModel;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>, id: number, field: keyof TaskModel) => void;
    toggleEdit      : (id: number) => void;
    saveEdit        : (id: number) => void;
    deleteTask      : (id: number) => void;
}

const TaskContainer = styled(Box)(({ theme }) => ({
    display      : "flex",
    flexDirection: "column",
    padding      : theme.spacing(2),
    borderBottom : "1px solid #ccc",
    borderRadius : theme.shape.borderRadius,
    marginBottom : theme.spacing(2),
}));

const ContenidoItem: React.FC<ContenidoItemProps> = ({ task, handleEditChange, toggleEdit, saveEdit, deleteTask }) => {
    console.log("🚀 ~ task:", task)
    const ContenidoForm = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TextField
                        label="Responsable"
                        name="responsable"
                        value={task.responsable}
                        onChange={(e: any) => handleEditChange(e, task.id, "responsable")}
                        variant="standard"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Institución"
                        name="institucion"
                        value={task.institucion}
                        onChange={(e: any) => handleEditChange(e, task.id, "institucion")}
                        variant="standard"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Título"
                        name="titulo"
                        value={task.titulo}
                        onChange={(e: any) => handleEditChange(e, task.id, "titulo")}
                        variant="standard"
                        multiline
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Hora"
                        name="hora"
                        value={task.hora}
                        onChange={(e: any) => handleEditChange(e, task.id, "hora")}
                        variant="standard"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Lugar"
                        name="lugar"
                        value={task.lugar}
                        onChange={(e: any) => handleEditChange(e, task.id, "lugar")}
                        variant="standard"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => saveEdit(task.id)} color="primary">
                        <Save />
                    </IconButton>
                    {!task.isNew && (
                        <IconButton onClick={() => toggleEdit(task.id)} color="default">
                            <Edit />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
        );
    }
    return (
        <TaskContainer>
            {
                task.isEditing ? (
                    <ContenidoForm />
                ) : task.isNew ? (
                        <ContenidoForm />
                    ) : (                    
                    
                        <>
                            <Typography variant="body1"><strong>Responsable:</strong> {task.responsable}</Typography>
                            <Typography variant="body1"><strong>Institución:</strong> {task.institucion}</Typography>
                            <Typography variant="body1"><strong>Título:</strong> {task.titulo}</Typography>
                            <Typography variant="body1"><strong>Hora:</strong> {task.hora}</Typography>
                            <Typography variant="body1"><strong>Lugar:</strong> {task.lugar}</Typography>
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton onClick={() => deleteTask(task.id)} color="error">
                                    <Delete />
                                </IconButton>
                                <IconButton onClick={() => toggleEdit(task.id)} color="primary">
                                    <Edit />
                                </IconButton>
                            </Box>
                        </>
                    )
            }
        </TaskContainer>
    );
};

export default ContenidoItem;
