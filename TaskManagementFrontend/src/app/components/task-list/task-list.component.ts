import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTasks, addTask, updateTask, deleteTask } from '../../store/actions/task.actions';
import { selectAllTasks } from '../../store/selectors/task.selectors';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  editingTask: Task | null = null;
  newTask: Task = {
    id: 0, // Set to 0; backend will generate the actual ID
    title: '',
    description: '',
    completed: false,
    createdDate: new Date()
  };

  constructor(private store: Store) {
    this.tasks$ = this.store.select(selectAllTasks);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }

  addTask() {
    if (this.newTask.title.trim()) {
      const taskToAdd: Task = { ...this.newTask, id: 0 }; // ID set to 0, backend will override
      this.store.dispatch(addTask({ task: taskToAdd }));
      // Reset the form
      this.newTask = {
        id: 0,
        title: '',
        description: '',
        completed: false,
        createdDate: new Date()
      };
    }
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
  }

  updateTask() {
    if (this.editingTask) {
      this.store.dispatch(updateTask({ task: this.editingTask }));
      this.editingTask = null;
    }
  }

  deleteTask(id: number) {
    this.store.dispatch(deleteTask({ id }));
  }
}