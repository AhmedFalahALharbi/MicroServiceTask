import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as TaskActions from '../actions/task.actions';

export interface TaskState {
  tasks: Task[];
  error: string | null;
}

export const initialState: TaskState = {
  tasks: [],
  error: null,
};

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, error: null })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({ ...state, error })),
  on(TaskActions.addTaskSuccess, (state, { task }) => ({ ...state, tasks: [...state.tasks, task], error: null })),
  on(TaskActions.addTaskFailure, (state, { error }) => ({ ...state, error })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => {
    const updatedTasks = state.tasks.map(t => (t.id === task.id ? task : t));
    return { ...state, tasks: updatedTasks, error: null };
  }),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({ ...state, error })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => {
    const updatedTasks = state.tasks.filter(t => t.id !== id);
    return { ...state, tasks: updatedTasks, error: null };
  }),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({ ...state, error })),
);