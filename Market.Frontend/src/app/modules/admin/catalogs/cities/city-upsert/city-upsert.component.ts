import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CitiesApiService } from '../../../../../api-services/cities/cities-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import {
  CreateCityCommand,
  UpdateCityCommand
} from '../../../../../api-services/cities/cities-api.model';
import {CityForm, CityFormService} from "../services/city-form.service";
import {applyServerErrors} from '../../../../../core/forms/server-errors';

export interface CityDialogData {
  mode: 'create' | 'edit';
  cityId?: number;
}

@Component({
  selector: 'app-city-upsert',
  standalone: false,
  templateUrl: './city-upsert.component.html',
  styleUrl: './city-upsert.component.scss',
  providers: [CityFormService]
})
export class CityUpsertComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CityUpsertComponent>);
  private data = inject<CityDialogData>(MAT_DIALOG_DATA);
  private api = inject(CitiesApiService);
  protected formService = inject(CityFormService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  form?: FormGroup<CityForm>;
  isLoading = false;
  /** opšta poruka greške sa backenda (prikazuje se iznad polja) */
  errorMessage: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';

    if (this.isEditMode && this.data.cityId) {
      this.loadCity(this.data.cityId);
    } else {
      this.form = this.formService.createCityForm();
    }
  }

  private loadCity(id: number): void {
    this.isLoading = true;

    this.api.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (city) => {
        this.form = this.formService.createCityForm(city);
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(this.translate.instant('CITIES.DIALOGS.ERROR_LOAD'));
        console.error('Load city error:', err);
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

    if (this.isEditMode && this.data.cityId) {
      this.updateCity(this.form);
    } else {
      this.createCity(this.form);
    }
  }

  private createCity(form: FormGroup<CityForm>): void {
    const command: CreateCityCommand = {
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
        console.error('Create city error:', err);
      }
    });
  }

  private updateCity(form: FormGroup<CityForm>): void {
    const command: UpdateCityCommand = {
      name: form.controls.name.value.trim(),
      // obavezno u PUT-u
      isEnabled: form.controls.isEnabled.value
    };

    this.api.update(this.data.cityId!, command).subscribe({
      next: () => {
        this.dialogRef.close(true); // Signal success (lista prikazuje poruku)
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = applyServerErrors(form, err);
        console.error('Update city error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
