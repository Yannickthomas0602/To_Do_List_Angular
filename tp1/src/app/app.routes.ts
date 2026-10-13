import { Routes } from '@angular/router';
import { Stats } from './stats';
import { TaskList } from './task-list';

export const routes: Routes = [
  // Vue principale avec le formulaire et la liste des tâches.
  { path: '', component: TaskList },
	// Vue des statistiques de la liste persistée.
	{ path: 'stats', component: Stats },
	// Toute URL inconnue revient à la liste.
	{ path: '**', redirectTo: '' },
];
