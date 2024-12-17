import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SubtaskComponent } from '../subtask/subtask.component';
import { CommonModule } from '@angular/common';
import { SubtaskService } from '../../services/subtask.service';
import { SubtaskType } from '../../models/subtask-type.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-task-modal',
  imports: [SubtaskComponent, CommonModule, ReactiveFormsModule],
  providers: [SubtaskService],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  @Input() name: string = ""
  @Input() description: string = ""
  @Input() status: string = ""
  @Input() color: string = ""
  @Input() id: string = ""
  @Input() subtasks: SubtaskType[] = [];

  @Output() closeTaskEvent = new EventEmitter<void>();

  closeModal() {
    this.closeTaskEvent.emit();
  }

  subtaskForm!: FormGroup

  constructor(private subtaskService: SubtaskService) {
      this.subtaskForm = new FormGroup({
        subtaskName: new FormControl('', [Validators.required]),
      });
    }

    hadError: boolean = false;
    isLoading: boolean = false


  onSubmit() {
    if (this.subtaskForm.valid) {
      this.isLoading = true
      const name = this.subtaskForm.value.subtaskName;

      this.subtaskService.createSubtask(name, this.id).subscribe({
        next: () => {
          this.isLoading = false
          // this.subtaskForm.reset();
        },
        error: () => {
          this.hadError = true;
          this.isLoading = false;
        },
      });
    }
  }
}
