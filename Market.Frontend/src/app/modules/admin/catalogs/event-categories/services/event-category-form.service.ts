import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {GetEventCategoryByIdQueryDto} from '../../../../../api-services/event-categories/event-categories-api.model';

/** Tipizirana forma kategorije: form.controls.name.value je string, ne any. */
export interface EventCategoryForm {
  name: FormControl<string>;
  isEnabled: FormControl<boolean>;
}

/**
 * Service for creating and managing event category forms.
 * Used in modal dialog for both create and edit operations.
 * Poruke grešaka prikazuje <app-fit-field-error> (core/forms/validation-messages.ts).
 */
@Injectable()
export class EventCategoryFormService {
  /** isto kao EventCategoryEntity.Constraints.NameMaxLength na backendu */
  readonly nameMaxLength = 100;

  /**
   * Create a event category form with validation.
   * If category data is provided, form is pre-filled (edit mode).
   */
  createCategoryForm(category?: GetEventCategoryByIdQueryDto): FormGroup<EventCategoryForm> {
    return new FormGroup<EventCategoryForm>({
      name: new FormControl(category?.name ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(this.nameMaxLength)
        ]
      }),
      // nova kategorija je aktivna
      isEnabled: new FormControl(category?.isEnabled ?? true, { nonNullable: true })
    });
  }
}
