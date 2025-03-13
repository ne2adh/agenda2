import React from "react";
import { Box, Card, CardActions, CardContent, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Save, Delete } from "@mui/icons-material";
import { TaskModel } from "./Contenido";

interface ContenidoItemProps {
    task            : TaskModel;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof TaskModel) => void;
    toggleEdit      : (id: string) => void;
    saveEdit        : (id: string) => void;
    deleteTask      : (id: string) => void;
}

const TaskContainer = styled(Box)(({ theme }) => ({
    display      : "flex",
    flexDirection: "column",
    borderBottom : "1px solid #ccc",
    borderRadius : theme.shape.borderRadius,
    marginBottom : theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    background: "#f9f9f9",
    borderLeft: "6px solid #1976d2",
    marginBottom: theme.spacing(2),
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    lineHeight: '1.1',
    marginBottom: theme.spacing(1.5),
    color: "#333",
}));

const ContenidoItem: React.FC<ContenidoItemProps> = ({ task, handleEditChange, toggleEdit, saveEdit, deleteTask }) => {
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
                        <StyledCard>
                            <CardContent sx={{ p: 1, py: 2 }}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Title variant="subtitle2">{task.titulo}</Title>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Responsable:</strong> {task.responsable}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Institución:</strong> {task.institucion}</Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Lugar:</strong> {task.lugar}</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Hora:</strong> {task.hora}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: "flex-end", p: 0 }}>
                                <IconButton onClick={() => deleteTask(task.id)} color="error">
                                    <Delete />
                                </IconButton>
                                <IconButton onClick={() => toggleEdit(task.id)} color="primary">
                                    <Edit />
                                </IconButton>
                            </CardActions>
                        </StyledCard>
                    )
            }
        </TaskContainer>
    );
};

export default ContenidoItem;
