import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetSeatByIdQueryDto } from '../../../../../api-services/seats/seats-api.model';

/** Typed seat form: form.controls.rowLabel.value is a string, not any. */
export interface SeatForm {
  sectorId: FormControl<number | null>;
  seatCategoryId: FormControl<number | null>;
  rowLabel: FormControl<string>;
  number: FormControl<number | null>;
  isEnabled: FormControl<boolean>;
}

/**
 * Service for creating seat forms.
 * Used in the modal dialog for both create and edit operations.
 * Field errors are shown by <app-fit-field-error> (core/forms/validation-messages.ts).
 */
@Injectable()
export class SeatFormService {
  /** same as SeatEntity.Constraints on the backend */
  readonly rowLabelMaxLength = 10;
  readonly numberMax = 1000;

  /**
   * Create a seat form with validation.
   * If seat data is provided, the form is pre-filled (edit mode).
   */
  createSeatForm(seat?: GetSeatByIdQueryDto): FormGroup<SeatForm> {
    return new FormGroup<SeatForm>({
      sectorId: new FormControl<number | null>(seat?.sectorId ?? null, {
        validators: [Validators.required]
      }),
      seatCategoryId: new FormControl<number | null>(seat?.seatCategoryId ?? null, {
        validators: [Validators.required]
      }),
      rowLabel: new FormControl(seat?.rowLabel ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(this.rowLabelMaxLength),
          Validators.pattern(/^[A-Za-z0-9]+$/)
        ]
      }),
      number: new FormControl<number | null>(seat?.number ?? null, {
        validators: [Validators.required, Validators.min(1), Validators.max(this.numberMax)]
      }),
      isEnabled: new FormControl(seat?.isEnabled ?? true, { nonNullable: true })
    });
  }
}