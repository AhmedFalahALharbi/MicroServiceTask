import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addTask } from '../../store/actions/task.actions';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'add-task.component.html'
})
export class AddTaskComponent {
  task: Task = { 
    id: 0, 
    title: '', 
    description: '', 
    completed: false, 
    createdDate: new Date() 
  };

  constructor(private store: Store) {}

  onSubmit() {
    if (this.task.title.trim()) {
      const newTask: Task = { 
        ...this.task, 
        id: Date.now() 
      };
      
      this.store.dispatch(addTask({ task: newTask }));
      
      this.task = { 
        id: 0, 
        title: '', 
        description: '', 
        completed: false, 
        createdDate: new Date() 
      };
    }
  }
}