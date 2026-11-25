import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EventCategoriesApiService } from '../../../../../api-services/event-categories/event-categories-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import {
  CreateEventCategoryCommand,
  UpdateEventCategoryCommand
} from '../../../../../api-services/event-categories/event-categories-api.model';
import {EventCategoryForm, EventCategoryFormService} from "../services/event-category-form.service";
import {applyServerErrors} from '../../../../../core/forms/server-errors';

export interface EventCategoryDialogData {
  mode: 'create' | 'edit';
  categoryId?: number;
}

@Component({
  selector: 'app-event-category-upsert',
  standalone: false,
  templateUrl: './event-category-upsert.component.html',
  styleUrl: './event-category-upsert.component.scss',
  providers: [EventCategoryFormService]
})
export class EventCategoryUpsertComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<EventCategoryUpsertComponent>);
  private data = inject<EventCategoryDialogData>(MAT_DIALOG_DATA);
  private api = inject(EventCategoriesApiService);
  protected formService = inject(EventCategoryFormService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  form?: FormGroup<EventCategoryForm>;
  isLoading = false;
  /** opšta poruka greške sa backenda (prikazuje se iznad polja) */
  errorMessage: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';

    if (this.isEditMode && this.data.categoryId) {
      this.loadCategory(this.data.categoryId);
    } else {
      this.form = this.formService.createCategoryForm();
    }
  }

  private loadCategory(id: number): void {
    this.isLoading = true;

    this.api.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (category) => {
        this.form = this.formService.createCategoryForm(category);
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(this.translate.instant('EVENT_CATEGORIES.DIALOGS.ERROR_LOAD'));
        console.error('Load category error:', err);
        this.dialogRef.close(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.form || this.isLoading) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    if (this.isEditMode && this.data.categoryId) {
      this.updateCategory(this.form);
    } else {
      this.createCategory(this.form);
    }
  }

  private createCategory(form: FormGroup<EventCategoryForm>): void {
    const command: CreateEventCategoryCommand = {
      name: form.controls.name.value.trim(),
      isEnabled: form.controls.isEnabled.value
    };

    this.api.create(command).subscribe({
      next: () => {
        this.dialogRef.close(true); // Signal success (lista prikazuje poruku)
      },
      error: (err) => {
        this.isLoading = false;
        // greške polja idu u mat-error, opšta poruka iznad forme; dijalog ostaje otvoren
        this.errorMessage = applyServerErrors(form, err);
        console.error('Create category error:', err);
      }
    });
  }

  private updateCategory(form: FormGroup<EventCategoryForm>): void {
    const command: UpdateEventCategoryCommand = {
      name: form.controls.name.value.trim(),
      // obavezno u PUT-u
      isEnabled: form.controls.isEnabled.value
    };

    this.api.update(this.data.categoryId!, command).subscribe({
      next: () => {
        this.dialogRef.close(true); // Signal success (lista prikazuje poruku)
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = applyServerErrors(form, err);
        console.error('Update category error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
