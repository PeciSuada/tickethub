import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetSeatCategoryByIdQueryDto } from '../../../../../api-services/seat-categories/seat-categories-api.model';

/** Typed seat category form: form.controls.name.value is a string, not any. */
export interface SeatCategoryForm {
  name: FormControl<string>;
  colorHex: FormControl<string>;
  isEnabled: FormControl<boolean>;
}

/**
 * Service for creating seat category forms.
 * Used in the modal dialog for both create and edit operations.
 * Field errors are shown by <app-fit-field-error> (core/forms/validation-messages.ts).
 */
@Injectable()
export class SeatCategoryFormService {
  /** same as SeatCategoryEntity.Constraints on the backend */
  readonly nameMaxLength = 100;
  readonly colorPattern = /^#[0-9A-Fa-f]{6}$/;

  createSeatCategoryForm(category?: GetSeatCategoryByIdQueryDto): FormGroup<SeatCategoryForm> {
    return new FormGroup<SeatCategoryForm>({
      name: new FormControl(category?.name ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(this.nameMaxLength)
        ]
      }),
      colorHex: new FormControl(category?.colorHex ?? '#3F51B5', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(this.colorPattern)]
      }),
      isEnabled: new FormControl(category?.isEnabled ?? true, { nonNullable: true })
    });
  }
}