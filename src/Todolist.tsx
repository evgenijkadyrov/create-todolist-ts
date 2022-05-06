import React, {ChangeEvent, useCallback} from 'react';
import {FilterValuesType} from './AppWithRedux';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTitleStatusAC, removeTaskAC} from "./state/tasks-reducer";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType

}

export const  Todolist=React.memo ((props: PropsType)=> {
    console.log('todolist called')
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])

    const dispatch = useDispatch()

    const removeTodolist = useCallback (() => {
        props.removeTodolist(props.id);
    },[props.removeTodolist,props.id])
    const changeTodolistTitle = useCallback ((title: string) => {
        props.changeTodolistTitle(props.id, title);
    },[props.changeTodolistTitle,props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id),[props.changeFilter,props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id),[props.changeFilter,props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id),[props.changeFilter,props.id]);

    let allTodolistTasks = tasks;
    let tasksForTodolist = allTodolistTasks;

    if (props.filter === "active") {
        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
    }
    if (props.filter === "completed") {
        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={(title) => {
            dispatch(addTaskAC(title, props.id))
        }}/>
        <div>
            {
                tasksForTodolist.map(t => <Task todolistId={props.id} task={t} key={t.id} />
                )
            }
        </div>
        <div>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'default'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})

type TaskTypeProps={
    task:TaskType
    todolistId:string
}


export const Task = React.memo((props:TaskTypeProps) => {
    const dispatch=useDispatch()
    const onClickHandler = () =>  dispatch(removeTaskAC(props.task.id, props.todolistId))
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(props.task.id, newIsDoneValue, props.todolistId))
    }
    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(changeTitleStatusAC(props.task.id, newValue, props.todolistId))
    },[props.task.id,props.todolistId ])

    return <div key={props.task.id} className={props.task.isDone ? "is-done" : ""}>
        <Checkbox
            checked={props.task.isDone}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
});

export default Todolist;