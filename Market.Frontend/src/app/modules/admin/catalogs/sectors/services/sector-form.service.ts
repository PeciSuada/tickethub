import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetSectorByIdQueryDto } from '../../../../../api-services/sectors/sectors-api.model';

/** Typed sector form: form.controls.name.value is a string, not any. */
export interface SectorForm {
  name: FormControl<string>;
  venueId: FormControl<number | null>;
  isEnabled: FormControl<boolean>;
}

/**
 * Service for creating sector forms.
 * Used in the modal dialog for both create and edit operations.
 * Field errors are shown by <app-fit-field-error> (core/forms/validation-messages.ts).
 */
@Injectable()
export class SectorFormService {
  /** same as SectorEntity.Constraints on the backend */
  readonly nameMaxLength = 100;

  /**
   * Create a sector form with validation.
   * If sector data is provided, the form is pre-filled (edit mode).
   */
  createSectorForm(sector?: GetSectorByIdQueryDto): FormGroup<SectorForm> {
    return new FormGroup<SectorForm>({
      name: new FormControl(sector?.name ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(this.nameMaxLength)
        ]
      }),
      venueId: new FormControl<number | null>(sector?.venueId ?? null, {
        validators: [Validators.required]
      }),
      isEnabled: new FormControl(sector?.isEnabled ?? true, { nonNullable: true })
    });
  }
}