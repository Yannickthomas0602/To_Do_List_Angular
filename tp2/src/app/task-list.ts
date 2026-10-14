import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Active les listes déroulantes Material utilisées pour filtrer et trier.
import { MatSelectModule } from '@angular/material/select';
import { Task } from './task.model';
import { TaskService } from './task.service';

// Composant de la vue principale contenant le formulaire et la liste.
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  // Service responsable de charger et sauvegarder les tâches.
  private readonly taskService = inject(TaskService);
  // Date du jour utilisée pour refuser une échéance passée.
  readonly today = getToday();
  // Liste complète des tâches.
  tasks: Task[] = [];
  // Identifiant de la tâche actuellement modifiée.
  editingTaskId: string | null = null;

  // Valeurs des contrôles de recherche, de filtre et de tri.
  statusFilter: 'all' | 'todo' | 'done' = 'all';
  searchText = '';
  sortOption: 'dueDate' | 'title' = 'dueDate';

  // Valeurs liées aux champs du formulaire.
  taskTitle = '';
  taskDescription = '';
  taskDueDate = '';

  // Liste affichée après filtrage, recherche et tri.
  get filteredTasks(): Task[] {
    const query = this.searchText.trim().toLocaleLowerCase();

    return this.tasks
      // Filtre selon le statut choisi.
      .filter(task =>
        this.statusFilter === 'all' ||
        (this.statusFilter === 'done' && task.done) ||
        (this.statusFilter === 'todo' && !task.done),
      )
      // Recherche dans le titre et la description.
      .filter(task => `${task.title} ${task.description ?? ''}`
        .toLocaleLowerCase().includes(query))
      // Trie une copie pour préserver le tableau original.
      .slice()
      .sort((firstTask, secondTask) => {
        if (this.sortOption === 'title') {
          return firstTask.title.localeCompare(secondTask.title, 'fr');
        }

        const firstDueDate = firstTask.dueDate || '9999-12-31';
        const secondDueDate = secondTask.dueDate || '9999-12-31';
        return firstDueDate.localeCompare(secondDueDate) ||
          firstTask.title.localeCompare(secondTask.title, 'fr');
      });
  }

  // Charge les tâches persistées lorsque la vue est créée.
  constructor() {
    this.tasks = this.taskService.getTasks();
  }

  // Ajoute une tâche ou enregistre les modifications d'une tâche.
  addTask(form: NgForm): void {
    if (!this.isFormValid()) {
      return;
    }

    if (this.editingTaskId) {
      // Le spread conserve les champs non modifiés de la tâche.
      this.tasks = this.tasks.map(task => task.id === this.editingTaskId
        ? {
            ...task,
            title: this.taskTitle.trim(),
            description: this.taskDescription.trim(),
            dueDate: this.taskDueDate,
            updatedAt: new Date().toISOString(),
          }
        : task,
      );
      this.editingTaskId = null;
    } else {
      const now = new Date().toISOString();
      this.tasks = [...this.tasks, {
        id: crypto.randomUUID(),
        title: this.taskTitle.trim(),
        description: this.taskDescription.trim(),
        dueDate: this.taskDueDate,
        done: false,
        createdAt: now,
        updatedAt: now,
      }];
    }

    // Sauvegarde chaque ajout ou modification.
    this.taskService.saveTasks(this.tasks);
    form.resetForm({ title: '', description: '', dueDate: null });
  }

  // Remplit le formulaire avec les données de la tâche sélectionnée.
  editTask(task: Task, form: NgForm): void {
    this.editingTaskId = task.id;
    form.resetForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
  }

  // Supprime une tâche après confirmation.
  deleteTask(task: Task, form: NgForm): void {
    if (!window.confirm(`Supprimer la tâche ${task.title} ?`)) {
      return;
    }

    this.tasks = this.tasks.filter(currentTask => currentTask.id !== task.id);
    if (this.editingTaskId === task.id) {
      this.editingTaskId = null;
      form.resetForm();
    }
    this.taskService.saveTasks(this.tasks);
  }

  // Inverse le statut de la tâche et sauvegarde la nouvelle liste.
  toggleTask(task: Task): void {
    this.tasks = this.tasks.map(currentTask => currentTask.id === task.id
      ? { ...currentTask, done: !currentTask.done, updatedAt: new Date().toISOString() }
      : currentTask,
    );
    this.taskService.saveTasks(this.tasks);
  }

  // Transforme une date ISO en date française lisible.
  formatDueDate(dueDate: string): string {
    const [year, month, day] = dueDate.split('-');
    return `${day}/${month}/${year}`;
  }

  // Vérifie le titre et l'échéance avant d'autoriser la soumission.
  isFormValid(): boolean {
    return this.taskTitle.trim().length >= 3 &&
      (!this.taskDueDate || this.taskDueDate >= this.today);
  }
}

// Retourne la date locale du jour au format YYYY-MM-DD.
function getToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
