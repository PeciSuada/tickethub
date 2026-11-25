import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {GetCityByIdQueryDto} from '../../../../../api-services/cities/cities-api.model';

/** Tipizirana forma grad: form.controls.name.value je string, ne any. */
export interface CityForm {
  name: FormControl<string>;
  isEnabled: FormControl<boolean>;
}

/**
 * Service for creating and managing city forms.
 * Used in modal dialog for both create and edit operations.
 * Poruke grešaka prikazuje <app-fit-field-error> (core/forms/validation-messages.ts).
 */
@Injectable()
export class CityFormService {
  /** isto kao CityEntity.Constraints.NameMaxLength na backendu */
  readonly nameMaxLength = 100;

  /**
   * Create a city form with validation.
   * If city data is provided, form is pre-filled (edit mode).
   */
  createCityForm(city?: GetCityByIdQueryDto): FormGroup<CityForm> {
    return new FormGroup<CityForm>({
      name: new FormControl(city?.name ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(this.nameMaxLength)
        ]
      }),
      // nova grad je aktivna
      isEnabled: new FormControl(city?.isEnabled ?? true, { nonNullable: true })
    });
  }
}
