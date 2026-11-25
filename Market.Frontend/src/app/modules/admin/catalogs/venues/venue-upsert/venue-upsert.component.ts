import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { VenuesApiService } from '../../../../../api-services/venues/venues-api.service';
import { CitiesApiService } from '../../../../../api-services/cities/cities-api.service';
import { ListCitiesQueryDto } from '../../../../../api-services/cities/cities-api.model';
import { ToasterService } from '../../../../../core/services/toaster.service';
import {
  CreateVenueCommand,
  UpdateVenueCommand
} from '../../../../../api-services/venues/venues-api.model';
import { VenueForm, VenueFormService } from '../services/venue-form.service';
import { applyServerErrors } from '../../../../../core/forms/server-errors';
import { allItemsPaging } from '../../../../../core/models/paging/paging-utils';

export interface VenueDialogData {
  mode: 'create' | 'edit';
  venueId?: number;
}

@Component({
  selector: 'app-venue-upsert',
  standalone: false,
  templateUrl: './venue-upsert.component.html',
  styleUrl: './venue-upsert.component.scss',
  providers: [VenueFormService]
})
export class VenueUpsertComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<VenueUpsertComponent>);
  private data = inject<VenueDialogData>(MAT_DIALOG_DATA);
  private api = inject(VenuesApiService);
  private citiesApi = inject(CitiesApiService);
  protected formService = inject(VenueFormService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  form?: FormGroup<VenueForm>;
  cities: ListCitiesQueryDto[] = [];
  isLoading = false;
  /** general error message from the backend (shown above the fields) */
  errorMessage: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.loadCities();

    if (this.isEditMode && this.data.venueId) {
      this.loadVenue(this.data.venueId);
    } else {
      this.form = this.formService.createVenueForm();
    }
  }

  private loadCities(): void {
    // the dropdown needs ALL cities, so allItemsPaging (default paging is 10 per page)
    this.citiesApi
      .list({ paging: allItemsPaging })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.cities = response.items;
        },
        error: (err) => {
          this.toaster.error(this.translate.instant('CITIES.DIALOGS.ERROR_LOAD_LIST'));
          console.error('Load cities error:', err);
        }
      });
  }

  private loadVenue(id: number): void {
    this.isLoading = true;

    this.api.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (venue) => {
        this.form = this.formService.createVenueForm(venue);
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(this.translate.instant('VENUES.DIALOGS.ERROR_LOAD'));
        console.error('Load venue error:', err);
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

    if (this.isEditMode && this.data.venueId) {
      this.updateVenue(this.form);
    } else {
      this.createVenue(this.form);
    }
  }

  private createVenue(form: FormGroup<VenueForm>): void {
    const command: CreateVenueCommand = {
      name: form.controls.name.value.trim(),
      address: form.controls.address.value.trim(),
      cityId: form.controls.cityId.value!,
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
        console.error('Create venue error:', err);
      }
    });
  }

  private updateVenue(form: FormGroup<VenueForm>): void {
    const command: UpdateVenueCommand = {
      name: form.controls.name.value.trim(),
      address: form.controls.address.value.trim(),
      cityId: form.controls.cityId.value!,
      isEnabled: form.controls.isEnabled.value
    };

    this.api.update(this.data.venueId!, command).subscribe({
      next: () => {
        this.dialogRef.close(true); // signal success (the list shows the message)
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = applyServerErrors(form, err);
        console.error('Update venue error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}