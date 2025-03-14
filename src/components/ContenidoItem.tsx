import React from "react";
import { Box, Card, CardActions, CardContent, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Edit, Save, Delete } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import { TaskModel } from "./Contenido";
import MuiAccordionSummary, {
    AccordionSummaryProps,
    accordionSummaryClasses,
  } from '@mui/material/AccordionSummary';
  import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
   
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
      {
        transform: 'rotate(90deg)',
      },
    [`& .${accordionSummaryClasses.content}`]: {
      marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
}));
interface ContenidoItemProps {
    task            : TaskModel;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof TaskModel) => void;
    toggleEdit      : (id: string) => void;
    saveEdit        : (id: string) => void;
    cancelEdit      : (id: string) => void;
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
    background: "#fff",
    boxShadow: "none",
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    lineHeight: '1.1',
    color: "#333",
}));

const ContenidoItem: React.FC<ContenidoItemProps> = ({ task, handleEditChange, toggleEdit, saveEdit, cancelEdit, deleteTask }) => {
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
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <IconButton onClick={() => saveEdit(task.id)} color="primary">
                        <Save />
                    </IconButton>
                    {!task.isEditing && (
                        <IconButton onClick={() => toggleEdit(task.id)} color="default">
                            <Edit />
                        </IconButton>
                    )}
                    <IconButton onClick={() => cancelEdit(task.id)} color="error">
                        <CancelIcon />
                    </IconButton>
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
                        <Accordion>
                            <AccordionSummary sx={{ justifyContent: 'space-between' }}>
                                <Title variant="subtitle2">{task.titulo}</Title>
                                <Typography sx={{ ml: 2 }}>{task.hora.substring(0, 5)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <StyledCard>
                                    <CardContent sx={{ p: 1, pt: 2 }}>
                                        <Grid container>                                            
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Responsable:</strong></Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}>{task.responsable}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Institución:</strong></Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}>{task.institucion}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}><strong>Lugar:</strong></Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography sx={{ fontSize: '12px', lineHeight: '1.1'}}>{task.lugar}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: "space-between", p: 0 }}>
                                        <IconButton onClick={() => deleteTask(task.id)} color="error" size="small">
                                            <Delete />
                                        </IconButton>
                                        <IconButton onClick={() => toggleEdit(task.id)} color="primary" size="small">
                                            <Edit />
                                        </IconButton>
                                    </CardActions>
                                </StyledCard>
                            </AccordionDetails>
                        </Accordion>
                    )
            }
            
        </TaskContainer>
    );
};

export default ContenidoItem;
