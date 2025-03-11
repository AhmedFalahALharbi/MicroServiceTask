import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component'; // Adjust path

export const routes: Routes = [
  { path: '', component: TaskListComponent } // Default route
];