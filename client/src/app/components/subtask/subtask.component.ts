import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.css',
})
export class SubtaskComponent {
  @Input() name: string = '';
}
