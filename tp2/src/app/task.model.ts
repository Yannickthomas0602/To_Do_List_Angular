// Décrit la structure d'une tâche sauvegardée dans l'application.
export interface Task {
  // Identifiant unique de la tâche.
  id: string;
  // Titre obligatoire de la tâche.
  title: string;
  // Description facultative de la tâche.
  description?: string;
  // Échéance facultative au format ISO YYYY-MM-DD.
  dueDate?: string;
  // Statut de la tâche : false pour à faire, true pour fait.
  done: boolean;
  // Date de création de la tâche.
  createdAt: string;
  // Date de dernière mise à jour de la tâche.
  updatedAt: string;
}
