import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTasks, addTask, updateTask, deleteTask } from '../../store/actions/task.actions';
import { selectAllTasks } from '../../store/selectors/task.selectors';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:  'add-task.component.html'
  
})
export class AddTaskComponent {
  task = { id: 0, title: '', description: '', completed: false, createdDate: new Date() };

  constructor(private store: Store) {}

  onSubmit() {
    this.store.dispatch(addTask({ task: { ...this.task, id: Date.now() } }));
    this.task = { id: 0, title: '', description: '', completed: false, createdDate: new Date() };
  }
}