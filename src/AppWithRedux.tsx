import React, {useCallback} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';

import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {

    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const dispatch = useDispatch()


    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(ChangeTodolistFilterAC(todolistId, value))
    }, [dispatch])

    const removeTodolist = useCallback((id: string) => {
        let action = RemoveTodolistAC(id)
        dispatch(action)

    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, title: string) => {

        dispatch(ChangeTodolistTitleAC(id, title))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {

        dispatch(AddTodolistAC(title))
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {


                            return <Grid item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        changeFilter={changeFilter}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
