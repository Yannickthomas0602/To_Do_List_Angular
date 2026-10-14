import { Injectable } from '@angular/core';
import { Task } from './task.model';

// Service chargé de lire et d'enregistrer les tâches dans le navigateur.
@Injectable({ providedIn: 'root' })
export class TaskService {
  // Clé utilisée pour retrouver les tâches dans localStorage.
  private readonly storageKey = 'tasks';

  // Récupère les tâches sauvegardées au démarrage de l'application.
  getTasks(): Task[] {
    // localStorage n'existe pas pendant le rendu côté serveur.
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      // Les données sont stockées sous forme de texte JSON.
      const value: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      // Ignore les données qui ne correspondent pas au modèle Task.
      return Array.isArray(value) ? value.filter(isTask) : [];
    } catch {
      // Retourne une liste vide si le JSON est invalide.
      return [];
    }
  }

  // Enregistre la liste complète après chaque changement.
  saveTasks(tasks: Task[]): void {
    // Évite l'accès à localStorage pendant le rendu côté serveur.
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      // Transforme le tableau en texte avant de le stocker.
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch {
      // Signale une erreur sans faire planter l'application.
      console.warn('Sauvegarde locale impossible');
    }
  }
}

// Vérifie qu'une valeur lue depuis localStorage est bien une tâche.
function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const task = value as Partial<Task>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.done === 'boolean' &&
    typeof task.createdAt === 'string' &&
    typeof task.updatedAt === 'string' &&
    (task.description === undefined || typeof task.description === 'string') &&
    (task.dueDate === undefined || typeof task.dueDate === 'string')
  );
}
