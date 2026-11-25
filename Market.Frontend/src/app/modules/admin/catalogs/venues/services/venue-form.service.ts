import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetVenueByIdQueryDto } from '../../../../../api-services/venues/venues-api.model';

/** Typed venue form: form.controls.name.value is a string, not any. */
export interface VenueForm {
  name: FormControl<string>;
  address: FormControl<string>;
  cityId: FormControl<number | null>;
  isEnabled: FormControl<boolean>;
}

/**
 * Service for creating venue forms.
 * Used in the modal dialog for both create and edit operations.
 * Field errors are shown by <app-fit-field-error> (core/forms/validation-messages.ts).
 */
@Injectable()
export class VenueFormService {
  /** same as VenueEntity.Constraints on the backend */
  readonly nameMaxLength = 150;
  readonly addressMaxLength = 200;

  /**
   * Create a venue form with validation.
   * If venue data is provided, the form is pre-filled (edit mode).
   */
  createVenueForm(venue?: GetVenueByIdQueryDto): FormGroup<VenueForm> {
    return new FormGroup<VenueForm>({
      name: new FormControl(venue?.name ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(this.nameMaxLength)
        ]
      }),
      address: new FormControl(venue?.address ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(this.addressMaxLength)
        ]
      }),
      cityId: new FormControl<number | null>(venue?.cityId ?? null, {
        validators: [Validators.required]
      }),
      isEnabled: new FormControl(venue?.isEnabled ?? true, { nonNullable: true })
    });
  }
}