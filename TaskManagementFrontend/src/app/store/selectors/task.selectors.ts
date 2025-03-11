import { createSelector } from '@ngrx/store';
import { TaskState } from '../reducers/task.reducer';

export const selectTaskState = (state: any) => state.task;

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);