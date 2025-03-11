import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddTaskComponent } from '../add-task/add-task.component';
import { loadTasks, addTask, updateTask, deleteTask } from '../../store/actions/task.actions';
import { selectAllTasks } from '../../store/selectors/task.selectors';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AddTaskComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<any[]>;
  editingTask: any = null;

  constructor(private store: Store) {
    this.tasks$ = this.store.select(selectAllTasks);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }

  editTask(task: any) {
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