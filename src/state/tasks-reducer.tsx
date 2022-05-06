import { TasksStateType} from '../AppWithRedux';
import {v1} from 'uuid';

import {addTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASKS',
    taskId: string,
    todolistId: string
}

export type addTaskAC = {
    type: 'ADD-TASK',
    title: string,
    todolistId: string
}
export type changeTaskActionType = {
    type: 'CHANGE-TASK-STATUS',
    id: string,
    isDone: boolean,
    todolistId: string
}
export type changeTitleActionType = ReturnType<typeof changeTitleStatusAC>

type ActionsType = RemoveTaskActionType | addTaskAC | changeTaskActionType | changeTitleActionType|addTodolistActionType|RemoveTodolistActionType

const initialState:TasksStateType={}

export const tasksReducer = (state: TasksStateType=initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASKS':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)};
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.id ? {
                    ...el,
                    isDone: action.isDone
                } : el)
            }
        case 'CHANGE-TITLE-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.id ? {
                    ...el,
                    title: action.title
                } : el)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
[action.todolistsId]:[]
            }
        case 'REMOVE-TODOLIST':
            let newState={...state}
            delete newState[action.id]
            return newState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASKS', taskId, todolistId}
}
export const addTaskAC = (title: string, todolistId: string): addTaskAC => {
    return {type: 'ADD-TASK', title, todolistId}
}
export const changeTaskStatusAC = (id: string, isDone: boolean, todolistId: string): changeTaskActionType => {
    return {type: 'CHANGE-TASK-STATUS', id, isDone, todolistId}
}
export const changeTitleStatusAC = (id: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TITLE-STATUS', id, title, todolistId} as const
}
