import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SeatsApiService } from '../../../../../api-services/seats/seats-api.service';
import { SectorsApiService } from '../../../../../api-services/sectors/sectors-api.service';
import { ListSectorsQueryDto } from '../../../../../api-services/sectors/sectors-api.model';
import { SeatCategoriesApiService } from '../../../../../api-services/seat-categories/seat-categories-api.service';
import { ListSeatCategoriesQueryDto } from '../../../../../api-services/seat-categories/seat-categories-api.model';
import { ToasterService } from '../../../../../core/services/toaster.service';
import {
  CreateSeatCommand,
  UpdateSeatCommand
} from '../../../../../api-services/seats/seats-api.model';
import { SeatForm, SeatFormService } from '../services/seat-form.service';
import { applyServerErrors } from '../../../../../core/forms/server-errors';
import { allItemsPaging } from '../../../../../core/models/paging/paging-utils';

export interface SeatDialogData {
  mode: 'create' | 'edit';
  seatId?: number;
}

@Component({
  selector: 'app-seat-upsert',
  standalone: false,
  templateUrl: './seat-upsert.component.html',
  styleUrl: './seat-upsert.component.scss',
  providers: [SeatFormService]
})
export class SeatUpsertComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SeatUpsertComponent>);
  private data = inject<SeatDialogData>(MAT_DIALOG_DATA);
  private api = inject(SeatsApiService);
  private sectorsApi = inject(SectorsApiService);
  private seatCategoriesApi = inject(SeatCategoriesApiService);
  protected formService = inject(SeatFormService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  form?: FormGroup<SeatForm>;
  sectors: ListSectorsQueryDto[] = [];
  seatCategories: ListSeatCategoriesQueryDto[] = [];
  isLoading = false;
  /** general error message from the backend (shown above the fields) */
  errorMessage: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.loadDropdowns();

    if (this.isEditMode && this.data.seatId) {
      this.loadSeat(this.data.seatId);
    } else {
      this.form = this.formService.createSeatForm();
    }
  }

  private loadDropdowns(): void {
    // the dropdowns need ALL items, so allItemsPaging (default paging is 10 per page)
    this.sectorsApi
      .list({ paging: allItemsPaging })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.sectors = response.items;
        },
        error: (err) => {
          this.toaster.error(this.translate.instant('SECTORS.DIALOGS.ERROR_LOAD_LIST'));
          console.error('Load sectors error:', err);
        }
      });

    this.seatCategoriesApi
      .list({ paging: allItemsPaging })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.seatCategories = response.items;
        },
        error: (err) => {
          this.toaster.error(this.translate.instant('SEAT_CATEGORIES.DIALOGS.ERROR_LOAD_LIST'));
          console.error('Load seat categories error:', err);
        }
      });
  }

  private loadSeat(id: number): void {
    this.isLoading = true;

    this.api.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (seat) => {
        this.form = this.formService.createSeatForm(seat);
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(this.translate.instant('SEATS.DIALOGS.ERROR_LOAD'));
        console.error('Load seat error:', err);
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

    if (this.isEditMode && this.data.seatId) {
      this.updateSeat(this.form);
    } else {
      this.createSeat(this.form);
    }
  }

  private createSeat(form: FormGroup<SeatForm>): void {
    const command: CreateSeatCommand = {
      sectorId: form.controls.sectorId.value!,
      seatCategoryId: form.controls.seatCategoryId.value!,
      rowLabel: form.controls.rowLabel.value.trim(),
      number: form.controls.number.value!,
      isEnabled: form.controls.isEnabled.value
    };

    this.api.create(command).subscribe({
      next: () => {
        this.dialogRef.close(true); // signal success (the list shows the message)
      },
      error: (err) => {
        this.isLoading = false;
        // field errors go to mat-error, the general message above the form; the dialog stays open
        this.errorMessage = applyServerErrors(form, err);
        console.error('Create seat error:', err);
      }
    });
  }

  private updateSeat(form: FormGroup<SeatForm>): void {
    const command: UpdateSeatCommand = {
      sectorId: form.controls.sectorId.value!,
      seatCategoryId: form.controls.seatCategoryId.value!,
      rowLabel: form.controls.rowLabel.value.trim(),
      number: form.controls.number.value!,
      isEnabled: form.controls.isEnabled.value
    };

    this.api.update(this.data.seatId!, command).subscribe({
      next: () => {
        this.dialogRef.close(true); // signal success (the list shows the message)
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = applyServerErrors(form, err);
        console.error('Update seat error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}