import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from './task.service';

// Composant de la vue /stats.
@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private readonly taskService = inject(TaskService);
  readonly tasks = this.taskService.getTasks();

  // Nombre total de tâches.
  get total(): number {
    return this.tasks.length;
  }

  get done(): number {
    return this.tasks.filter(task => task.done).length;
  }

  get todo(): number {
    return this.total - this.done;
  }

  get completionRate(): number {
    return this.total === 0 ? 0 : Math.round((this.done / this.total) * 100);
  }
}
