import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SeatsApiService } from '../../../../../api-services/seats/seats-api.service';
import { GenerateSeatsCommand } from '../../../../../api-services/seats/seats-api.model';
import { SectorsApiService } from '../../../../../api-services/sectors/sectors-api.service';
import { ListSectorsQueryDto } from '../../../../../api-services/sectors/sectors-api.model';
import { SeatCategoriesApiService } from '../../../../../api-services/seat-categories/seat-categories-api.service';
import { ListSeatCategoriesQueryDto } from '../../../../../api-services/seat-categories/seat-categories-api.model';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { applyServerErrors } from '../../../../../core/forms/server-errors';
import { allItemsPaging } from '../../../../../core/models/paging/paging-utils';

/** Typed generator form (same limits as GenerateSeatsCommandValidator on the backend). */
interface GenerateForm {
  sectorId: FormControl<number | null>;
  seatCategoryId: FormControl<number | null>;
  firstRow: FormControl<string>;
  rowCount: FormControl<number>;
  seatsPerRow: FormControl<number>;
}

@Component({
  selector: 'app-seat-generate',
  standalone: false,
  templateUrl: './seat-generate.component.html',
  styleUrl: './seat-generate.component.scss'
})
export class SeatGenerateComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SeatGenerateComponent>);
  private api = inject(SeatsApiService);
  private sectorsApi = inject(SectorsApiService);
  private seatCategoriesApi = inject(SeatCategoriesApiService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  readonly maxRows = 26;
  readonly maxSeatsPerRow = 100;

  form: FormGroup<GenerateForm> = new FormGroup<GenerateForm>({
    sectorId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    seatCategoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    firstRow: new FormControl('A', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z]$/)]
    }),
    rowCount: new FormControl(10, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(this.maxRows)]
    }),
    seatsPerRow: new FormControl(20, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(this.maxSeatsPerRow)]
    })
  });

  sectors: ListSectorsQueryDto[] = [];
  seatCategories: ListSeatCategoriesQueryDto[] = [];
  isLoading = false;
  /** general error message from the backend (shown above the fields) */
  errorMessage: string | null = null;
  /** number of created seats, shown after a successful generation */
  createdCount: number | null = null;

  ngOnInit(): void {
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

  /** Preview of how many seats will be created (rows x seats per row). */
  get totalSeats(): number {
    const rows = this.form.controls.rowCount.value;
    const perRow = this.form.controls.seatsPerRow.value;
    return rows > 0 && perRow > 0 ? rows * perRow : 0;
  }

  /** Preview of the row range, e.g. "A - J". */
  get rowRange(): string {
    const first = this.form.controls.firstRow.value.toUpperCase();
    if (!/^[A-Z]$/.test(first)) {
      return '';
    }
    const last = first.charCodeAt(0) + Math.max(this.form.controls.rowCount.value, 1) - 1;
    return last > 90 ? '' : `${first} - ${String.fromCharCode(last)}`;
  }

  onSubmit(): void {
    if (this.isLoading) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const command: GenerateSeatsCommand = {
      sectorId: this.form.controls.sectorId.value!,
      seatCategoryId: this.form.controls.seatCategoryId.value!,
      firstRow: this.form.controls.firstRow.value.trim().toUpperCase(),
      rowCount: this.form.controls.rowCount.value,
      seatsPerRow: this.form.controls.seatsPerRow.value
    };

    this.api.generate(command).subscribe({
      next: (count) => {
        this.isLoading = false;
        this.createdCount = count;
      },
      error: (err) => {
        this.isLoading = false;
        // field errors go to mat-error, the general message above the form; the dialog stays open
        this.errorMessage = applyServerErrors(this.form, err);
        console.error('Generate seats error:', err);
      }
    });
  }

  onCancel(): void {
    // true when seats were created, so the list reloads
    this.dialogRef.close(this.createdCount !== null);
  }
}