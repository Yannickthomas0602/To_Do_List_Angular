import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Service responsable de la persistance des tâches.
  private readonly taskService = inject(TaskService);
  // Récupère la date du jour 
  readonly today = getToday();
  tasks: Task[] = [];
  editingTaskId: string | null = null;

  // Valeurs utilisées par les contrôles de filtrage et de recherche.
  statusFilter: 'all' | 'todo' | 'done' = 'all';
  searchText = '';
  sortOption: 'dueDate' | 'title' = 'dueDate';

// Initialisation des champs du form 
  taskTitle = '';
  taskDescription = '';
  taskDueDate = '';

  // Retourne la liste filtrée, recherchée et triée pour l'affichage.
  get filteredTasks(): Task[] {
    // Nettoie la recherche et ignore les majuscules/minuscules.
    const query = this.searchText.trim().toLocaleLowerCase();

    // Construit une nouvelle liste sans modifier la liste complète des tâches.
    return this.tasks
      // Filtre selon le statut sélectionné.
      .filter(task =>
        this.statusFilter === 'all' ||
        (this.statusFilter === 'done' && task.done) ||
        (this.statusFilter === 'todo' && !task.done),
      )
      // Recherche dans le titre et dans la description.
      .filter(task => {
        // Regroupe les textes de la tâche pour effectuer une seule recherche.
        const text = `${task.title} ${task.description ?? ''}`.toLocaleLowerCase();
        // Conserve les tâches qui contiennent le texte recherché.
        return text.includes(query);
      })
      // Copie le résultat avant le tri pour ne pas modifier tasks.
      .slice()
      // Trie la liste 
      .sort((firstTask, secondTask) => {
        // Le tri par titre compare les titres dans l'ordre alphabétique français.
        if (this.sortOption === 'title') {
          return firstTask.title.localeCompare(secondTask.title, 'fr');
        }

        // Les tâches sans date sont placées après celles qui ont une échéance.
        const firstDueDate = firstTask.dueDate || '9999-12-31';
        const secondDueDate = secondTask.dueDate || '9999-12-31';
        // En cas d'échéance identique, le titre départage les tâches.
        return firstDueDate.localeCompare(secondDueDate) ||
          firstTask.title.localeCompare(secondTask.title, 'fr');
      });
  }

  // Charge les tâches déjà présentes dans localStorage au démarrage.
  constructor() {
    this.tasks = this.taskService.getTasks();
  }

  // Ajoute une nouvelle tâche ou modifie une tache
  addTask(form: NgForm): void {
    if (!this.isFormValid()) {
      return;
    }

// Si l'id de la tache existe alors c'est considéré comme un modif 
    if (this.editingTaskId) {
      // Copie la liste des tâches et modifie uniquement celle indiquée
      this.tasks = this.tasks.map(task => task.id === this.editingTaskId
        ? {
            // Recopie les anciennes propriétés de la tâche.
            ...task,
            // Remplace le titre par la valeur du formulaire.
            title: this.taskTitle.trim(),
            // Remplace la description par la valeur du formulaire.
            description: this.taskDescription.trim(),
            // Remplace l'échéance par la valeur du formulaire.
            dueDate: this.taskDueDate,
            // Actualise la date de dernière modification.
            updatedAt: new Date().toISOString(),
          }
        // Laisse les autres tâches inchangées.
        : task,
      );
      // Quitte le mode modification après l'enregistrement.
      this.editingTaskId = null;
    } else {
      // Crée une date commune pour la création et la mise à jour initiale.
      const now = new Date().toISOString();
      // Ajoute une nouvelle tâche à la fin du tableau.
      this.tasks = [...this.tasks, {
        // Génère un identifiant unique pour cette tâche.
        id: crypto.randomUUID(),
        title: this.taskTitle.trim(),
        description: this.taskDescription.trim(),
        // Conserve la date au format YYYY-MM-DD fourni par input[type="date"].
        dueDate: this.taskDueDate,
        done: false,
        createdAt: now,
        updatedAt: now,
      }];
    }

    // Sauvegarde la liste après l'ajout ou la modification.
    this.taskService.saveTasks(this.tasks);

    // Reset les champs après un ajout
    form.resetForm({
      title: '',
      description: '',
      dueDate: null,
    });
  }

  // Remplace les champs vide par les valeurs de la tache a modifier 
  editTask(task: Task, form: NgForm): void {
    this.editingTaskId = task.id;
    form.resetForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
  }

  // Supprime une tâche
  deleteTask(task: Task, form: NgForm): void {
    if (!window.confirm(`Supprimer la tâche  ${task.title}  ?`)) {
      return;
    }

    // Conserve toutes les tâches sauf celle qui doit être supprimée.
    this.tasks = this.tasks.filter(currentTask => currentTask.id !== task.id);

    // Si la tâche supprimée était éditée, quitte le mode modification.
    if (this.editingTaskId === task.id) {
      this.editingTaskId = null;
      form.resetForm();
    }

    // Met à jour localStorage après la suppression confirmée.
    this.taskService.saveTasks(this.tasks);
  }

  // Inverse l'état d'une tâche entre à faire et fait.
  toggleTask(task: Task): void {
    // Crée une nouvelle version de la tâche avec le statut inversé.
    this.tasks = this.tasks.map(currentTask => currentTask.id === task.id
      ? {
          ...currentTask,
          done: !currentTask.done,
          updatedAt: new Date().toISOString(),
        }
      : currentTask,
    );

    // Met à jour localStorage après le changement de statut.
    this.taskService.saveTasks(this.tasks);
  }

  // Transforme en date lisible 
  formatDueDate(dueDate: string): string {
    const [year, month, day] = dueDate.split('-');
    return `${day}/${month}/${year}`;
  }

  // Vérifie les règles d'acceptation du formulaire.
  isFormValid(): boolean {
    // Le titre doit avoir au moins trois caractères après suppression des espaces.
    return this.taskTitle.trim().length >= 3 &&
      // La date est optionnelle, mais elle ne peut pas être antérieure à aujourd'hui.
      (!this.taskDueDate || this.taskDueDate >= this.today);
  }
}

// Renvoie la date du jour 
function getToday(): string {
  // Récupère la date et l'heure du navigateur.
  const now = new Date();
  // Récupère l'année 
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
