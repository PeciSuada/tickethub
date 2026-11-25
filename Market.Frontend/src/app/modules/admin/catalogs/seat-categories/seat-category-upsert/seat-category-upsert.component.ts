import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SeatCategoriesApiService } from '../../../../../api-services/seat-categories/seat-categories-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import {
  CreateSeatCategoryCommand,
  UpdateSeatCategoryCommand
} from '../../../../../api-services/seat-categories/seat-categories-api.model';
import { SeatCategoryForm, SeatCategoryFormService } from '../services/seat-category-form.service';
import { applyServerErrors } from '../../../../../core/forms/server-errors';

export interface SeatCategoryDialogData {
  mode: 'create' | 'edit';
  categoryId?: number;
}

@Component({
  selector: 'app-seat-category-upsert',
  standalone: false,
  templateUrl: './seat-category-upsert.component.html',
  styleUrl: './seat-category-upsert.component.scss',
  providers: [SeatCategoryFormService]
})
export class SeatCategoryUpsertComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SeatCategoryUpsertComponent>);
  private data = inject<SeatCategoryDialogData>(MAT_DIALOG_DATA);
  private api = inject(SeatCategoriesApiService);
  protected formService = inject(SeatCategoryFormService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  form?: FormGroup<SeatCategoryForm>;
  isLoading = false;
  /** general error message from the backend (shown above the fields) */
  errorMessage: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';

    if (this.isEditMode && this.data.categoryId) {
      this.loadCategory(this.data.categoryId);
    } else {
      this.form = this.formService.createSeatCategoryForm();
    }
  }

  private loadCategory(id: number): void {
    this.isLoading = true;

    this.api.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (category) => {
        this.form = this.formService.createSeatCategoryForm(category);
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(this.translate.instant('SEAT_CATEGORIES.DIALOGS.ERROR_LOAD'));
        console.error('Load seat category error:', err);
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

    const command: CreateSeatCategoryCommand | UpdateSeatCategoryCommand = {
      name: this.form.controls.name.value.trim(),
      colorHex: this.form.controls.colorHex.value.toUpperCase(),
      isEnabled: this.form.controls.isEnabled.value
    };

    const handlers = {
      next: () => {
        this.dialogRef.close(true); // signal success (the list shows the message)
      },
      error: (err: any) => {
        this.isLoading = false;
        // field errors go to mat-error, the general message above the form; the dialog stays open
        this.errorMessage = applyServerErrors(this.form!, err);
        console.error('Save seat category error:', err);
      }
    };

    if (this.isEditMode && this.data.categoryId) {
      this.api.update(this.data.categoryId, command).subscribe(handlers);
    } else {
      this.api.create(command).subscribe(handlers);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}