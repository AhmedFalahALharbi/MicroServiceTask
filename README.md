This is a full documntation for the project:
Task Management System

This is a full-stack Task Management System built with an Angular frontend using NgRx for state management and .NET Core microservices for the backend, connected to SQL Server. The system supports CRUD operations for tasks and includes an optional User microservice.
Table of Contents

    Prerequisites
    Setup Instructions
        Angular Frontend
        Task Microservice
        User Microservice (Optional)
    NgRx State Management
    Running the Application

Prerequisites

    Node.js: Version 18.x or later (Download).
    Angular CLI: Install globally with npm install -g @angular/cli.
    .NET SDK: Version 8.x (Download).
    SQL Server: Express or Developer edition, or an existing instance.
    IDE: Visual Studio Code, Visual Studio 2022, or JetBrains Rider recommended.

Setup Instructions
Angular Frontend

    Create the Project:
    bash

ng new TaskManagementFrontend
cd TaskManagementFrontend
Install Dependencies:
bash
ng add @ngrx/store
ng add @ngrx/effects
ng add @ngrx/store-devtools
Project Structure:

    src/app/components: Contains task-list and add-task components.
    src/app/models: Includes task.model.ts for the Task interface.
    src/app/store: Houses NgRx files (actions, reducers, effects, selectors).
    src/app/services: Contains task.service.ts for HTTP communication.

Configure AppModule: Update src/app/app.module.ts:
typescript

    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/core';
    import { FormsModule } from '@angular/forms';
    import { HttpClientModule } from '@angular/common/http';
    import { StoreModule } from '@ngrx/store';
    import { EffectsModule } from '@ngrx/effects';
    import { StoreDevtoolsModule } from '@ngrx/store-devtools';
    import { AppComponent } from './app.component';
    import { TaskListComponent } from './components/task-list/task-list.component';
    import { AddTaskComponent } from './components/add-task/add-task.component';
    import { taskReducer } from './store/reducers/task.reducer';
    import { TaskEffects } from './store/effects/task.effects';

    @NgModule({
      declarations: [AppComponent, TaskListComponent, AddTaskComponent],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        StoreModule.forRoot({ tasks: taskReducer }),
        EffectsModule.forRoot([TaskEffects]),
        StoreDevtoolsModule.instrument()
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule {}
    Components:
        TaskListComponent: Displays tasks with edit/delete options.
        AddTaskComponent: Form to add new tasks.

Task Microservice

    Create the Project:
    bash

dotnet new webapi -n TaskMicroservice
cd TaskMicroservice
Install NuGet Packages:
bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Swashbuckle.AspNetCore
Configure Database:

    Update appsettings.json:
    json

    {
      "ConnectionStrings": {
        "DefaultConnection": "Server=localhost;Database=TaskDb;Trusted_Connection=True;MultipleActiveResultSets=true"
      }
    }

Setup:

    Define Task model in Models/Task.cs.
    Create TaskDbContext in Data/TaskDbContext.cs.
    Implement TaskService in Services/TaskService.cs for CRUD operations.
    Create TasksController in Controllers/TasksController.cs.

Configure Program.cs:
csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<TaskService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
        builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();
app.Run();
Run Migrations:
bash

    dotnet ef migrations add InitialCreate
    dotnet ef database update

User Microservice (Optional)

    Create the Project:
    bash

dotnet new webapi -n UserMicroservice
cd UserMicroservice
Install NuGet Packages:
bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Swashbuckle.AspNetCore
Configure Database:

    Update appsettings.json:
    json

    {
      "ConnectionStrings": {
        "DefaultConnection": "Server=localhost;Database=UserDb;Trusted_Connection=True;MultipleActiveResultSets=true"
      }
    }

Setup:

    Define User model in Models/User.cs:
    csharp

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
    Create UserDbContext in Data/UserDbContext.cs.
    Implement UserService in Services/UserService.cs for CRUD operations.
    Create UsersController in Controllers/UsersController.cs.

Configure Program.cs:
csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<UserService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
        builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();
app.Run();
Run Migrations:
bash

    dotnet ef migrations add InitialCreate
    dotnet ef database update

NgRx State Management

NgRx is integrated into the Angular frontend to manage the state of tasks in a reactive, centralized manner. Here’s how it works:
State Structure

    The state is stored as a tasks slice:
    typescript

    export interface TaskState {
      tasks: Task[];
      error: string | null;
    }
    export const initialState: TaskState = { tasks: [], error: null };
    Task is defined in models/task.model.ts with properties: id, title, description, completed, createdDate.

Actions

    Defined in store/actions/task.actions.ts:
    typescript

    export const loadTasks = createAction('[Task] Load Tasks');
    export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
    export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
    export const updateTask = createAction('[Task] Update Task', props<{ task: Task }>());
    export const deleteTask = createAction('[Task] Delete Task', props<{ id: number }>());

Reducer

    Handles state updates in store/reducers/task.reducer.ts:
    typescript

    export const taskReducer = createReducer(
      initialState,
      on(loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, error: null })),
      on(addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
      on(updateTask, (state, { task }) => ({
        ...state,
        tasks: state.tasks.map(t => t.id === task.id ? task : t)
      })),
      on(deleteTask, (state, { id }) => ({
        ...state,
        tasks: state.tasks.filter(t => t.id !== id)
      }))
    );

Effects

    Manage side effects (e.g., API calls) in store/effects/task.effects.ts:
    typescript

    @Injectable()
    export class TaskEffects {
      constructor(private actions$: Actions, private taskService: TaskService) {}
      loadTasks$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadTasks),
          mergeMap(() => this.taskService.getTasks().pipe(
            map(tasks => loadTasksSuccess({ tasks })),
            catchError(error => of({ type: '[Task] Load Tasks Failure', error }))
          ))
        )
      );
    }

Selectors

    Access state in store/selectors/task.selectors.ts:
    typescript

    export const selectTaskState = (state: any) => state.tasks;
    export const selectAllTasks = createSelector(selectTaskState, (state) => state.tasks);

Integration

    Registered in AppModule with StoreModule.forRoot and EffectsModule.forRoot.
    Components dispatch actions (e.g., loadTasks, addTask) and use selectors (e.g., selectAllTasks) to display data.

Running the Application

    Start the Task Microservice:
    bash

cd TaskMicroservice
dotnet run

    Access Swagger at http://localhost:5000/swagger.

Start the User Microservice (Optional):
bash
cd UserMicroservice
dotnet run

    Access Swagger at http://localhost:5001/swagger.

Start the Angular Frontend:
bash

    cd TaskManagementFrontend
    ng serve
        Open http://localhost:4200 in your browser.

FRONT END:

Project Structure

    src/app/components: task-list.component.ts, add-task.component.ts
    src/app/models: task.model.ts
    src/app/services: task.service.ts
    src/app/store: task.actions.ts, task.reducer.ts, task.effects.ts, task.selectors.ts
    src/app: app.module.ts, app.component.ts, app.component.html

Step 1: Define the Task Model
src/app/models/task.model.ts
typescript
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdDate: Date;
}
Step 2: Set Up NgRx State Management
src/app/store/actions/task.actions.ts
typescript
import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: string }>());

export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const addTaskSuccess = createAction('[Task] Add Task Success', props<{ task: Task }>());
export const addTaskFailure = createAction('[Task] Add Task Failure', props<{ error: string }>());

export const updateTask = createAction('[Task] Update Task', props<{ task: Task }>());
export const updateTaskSuccess = createAction('[Task] Update Task Success', props<{ task: Task }>());
export const updateTaskFailure = createAction('[Task] Update Task Failure', props<{ error: string }>());

export const deleteTask = createAction('[Task] Delete Task', props<{ id: number }>());
export const deleteTaskSuccess = createAction('[Task] Delete Task Success', props<{ id: number }>());
export const deleteTaskFailure = createAction('[Task] Delete Task Failure', props<{ error: string }>());
src/app/store/reducers/task.reducer.ts
typescript
import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models/task.model';
import * as TaskActions from '../actions/task.actions';

export interface TaskState {
  tasks: Task[];
  error: string | null;
}

export const initialState: TaskState = {
  tasks: [],
  error: null
};

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, error: null })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({ ...state, error })),
  on(TaskActions.addTaskSuccess, (state, { task }) => ({ ...state, tasks: [...state.tasks, task], error: null })),
  on(TaskActions.addTaskFailure, (state, { error }) => ({ ...state, error })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
    error: null
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({ ...state, error })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    error: null
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({ ...state, error }))
);
src/app/store/effects/task.effects.ts
typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import * as TaskActions from '../actions/task.actions';

@Injectable()
export class TaskEffects {
  constructor(private actions$: Actions, private taskService: TaskService) {}

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TaskActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(action =>
        this.taskService.addTask(action.task).pipe(
          map(task => TaskActions.addTaskSuccess({ task })),
          catchError(error => of(TaskActions.addTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(action =>
        this.taskService.updateTask(action.task).pipe(
          map(task => TaskActions.updateTaskSuccess({ task })),
          catchError(error => of(TaskActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(action =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id: action.id })),
          catchError(error => of(TaskActions.deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );
}
src/app/store/selectors/task.selectors.ts
typescript
import { createSelector } from '@ngrx/store';
import { TaskState } from '../reducers/task.reducer';

export const selectTaskState = (state: any) => state.tasks;

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);
Step 3: Create the Task Service
src/app/services/task.service.ts
typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks'; // Adjust port if needed

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
Step 4: Implement Components
src/app/components/add-task/add-task.component.ts
typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTask } from '../../store/actions/task.actions';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  task: Task = { id: 0, title: '', description: '', completed: false, createdDate: new Date() };

  constructor(private store: Store) {}

  onSubmit() {
    this.store.dispatch(addTask({ task: { ...this.task } })); // ID will be set by backend
    this.task = { id: 0, title: '', description: '', completed: false, createdDate: new Date() };
  }
}
src/app/components/add-task/add-task.component.html
html
<form (ngSubmit)="onSubmit()" class="add-task-form">
  <input [(ngModel)]="task.title" name="title" placeholder="Task Title" required>
  <textarea [(ngModel)]="task.description" name="description" placeholder="Task Description"></textarea>
  <button type="submit">Add Task</button>
</form>
src/app/components/add-task/add-task.component.css
css
.add-task-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.add-task-form input,
.add-task-form textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.add-task-form input:focus,
.add-task-form textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.add-task-form textarea {
  resize: vertical;
  min-height: 100px;
}

.add-task-form button {
  padding: 12px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-task-form button:hover {
  background-color: #218838;
}
src/app/components/task-list/task-list.component.ts
typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { loadTasks, updateTask, deleteTask } from '../../store/actions/task.actions';
import { selectAllTasks } from '../../store/selectors/task.selectors';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  editingTask: Task | null = null;

  constructor(private store: Store) {
    this.tasks$ = this.store.select(selectAllTasks);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
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
src/app/components/task-list/task-list.component.html
html
<div class="container">
  <app-add-task></app-add-task>
  <h2>Task List</h2>
  <ul class="task-list">
    <li *ngFor="let task of tasks$ | async" class="task-item">
      <div class="task-info">
        <div class="task-title">{{ task.title }}</div>
        <div class="task-description">{{ task.description }}</div>
        <div class="task-status">{{ task.completed ? 'Completed' : 'Pending' }}</div>
      </div>
      <div class="task-actions">
        <button class="btn btn-edit" (click)="editTask(task)">Edit</button>
        <button class="btn btn-delete" (click)="deleteTask(task.id)">Delete</button>
      </div>
    </li>
  </ul>

  <div *ngIf="editingTask" class="edit-task-form">
    <h3>Edit Task</h3>
    <form (ngSubmit)="updateTask()">
      <input [(ngModel)]="editingTask.title" name="title" placeholder="Title" required>
      <textarea [(ngModel)]="editingTask.description" name="description" placeholder="Description"></textarea>
      <label>
        <input type="checkbox" [(ngModel)]="editingTask.completed" name="completed"> Completed
      </label>
      <button type="submit">Update Task</button>
      <button type="button" (click)="editingTask = null">Cancel</button>
    </form>
  </div>
</div>
src/app/components/task-list/task-list.component.css
css
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h2, h3 {
  text-align: center;
  color: #007bff;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.task-description {
  font-size: 14px;
  color: #666;
}

.task-status {
  font-size: 14px;
  color: #007bff;
  font-weight: bold;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #ffc107;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.btn-delete {
  background-color: #dc3545;
}

.btn-delete:hover {
  background-color: #c82333;
}

.edit-task-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.edit-task-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edit-task-form input,
.edit-task-form textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.edit-task-form input:focus,
.edit-task-form textarea:focus {
  outline: none;
  border-color: #007bff;
}

.edit-task-form textarea {
  resize: vertical;
  min-height: 100px;
}

.edit-task-form label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-task-form button[type="submit"] {
  background-color: #28a745;
  padding: 12px;
}

.edit-task-form button[type="submit"]:hover {
  background-color: #218838;
}

.edit-task-form button[type="button"] {
  background-color: #6c757d;
  padding: 12px;
}

.edit-task-form button[type="button"]:hover {
  background-color: #5a6268;
}
Step 5: Configure the App Module
src/app/app.module.ts
typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { taskReducer } from './store/reducers/task.reducer';
import { TaskEffects } from './store/effects/task.effects';

@NgModule({
  declarations: [AppComponent, TaskListComponent, AddTaskComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ tasks: taskReducer }),
    EffectsModule.forRoot([TaskEffects]),
    StoreDevtoolsModule.instrument()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
src/app/app.component.html
html
<app-task-list></app-task-list>
src/app/app.component.ts
typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {}
Step 6: Run the Application

    Start the Task Microservice:
    bash

cd TaskMicroservice
dotnet run

    Ensure it’s running at http://localhost:5000.

Run the Angular App:
bash

    cd TaskManagementFrontend
    ng serve
        Open http://localhost:4200 in your browser.

Features

    Create: Add new tasks via the AddTaskComponent form, styled with a clean, modern design.
    Read: Display tasks in a styled list with hover effects, fetched from the backend via NgRx effects.
    Update: Edit tasks inline with a form that appears below the list, dispatching updates to the backend.
    Delete: Remove tasks with a styled delete button, synced with the backend.
