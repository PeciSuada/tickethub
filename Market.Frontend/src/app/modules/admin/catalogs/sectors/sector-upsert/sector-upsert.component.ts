import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SectorsApiService } from '../../../../../api-services/sectors/sectors-api.service';
import { VenuesApiService } from '../../../../../api-services/venues/venues-api.service';
import { ListVenuesQueryDto } from '../../../../../api-services/venues/venues-api.model';
import { ToasterService } from '../../../../../core/services/toaster.service';
import {
  CreateSectorCommand,
  UpdateSectorCommand
} from '../../../../../api-services/sectors/sectors-api.model';
import { SectorForm, SectorFormService } from '../services/sector-form.service';
import { applyServerErrors } from '../../../../../core/forms/server-errors';
import { allItemsPaging } from '../../../../../core/models/paging/paging-utils';

export interface SectorDialogData {
  mode: 'create' | 'edit';
  sectorId?: number;
}

@Component({
  selector: 'app-sector-upsert',
  standalone: false,
  templateUrl: './sector-upsert.component.html',
  styleUrl: './sector-upsert.component.scss',
  providers: [SectorFormService]
})
export class SectorUpsertComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SectorUpsertComponent>);
  private data = inject<SectorDialogData>(MAT_DIALOG_DATA);
  private api = inject(SectorsApiService);
  private venuesApi = inject(VenuesApiService);
  protected formService = inject(SectorFormService);
  private toaster = inject(ToasterService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  form?: FormGroup<SectorForm>;
  venues: ListVenuesQueryDto[] = [];
  isLoading = false;
  /** general error message from the backend (shown above the fields) */
  errorMessage: string | null = null;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.loadVenues();

    if (this.isEditMode && this.data.sectorId) {
      this.loadSector(this.data.sectorId);
    } else {
      this.form = this.formService.createSectorForm();
    }
  }

  private loadVenues(): void {
    // the dropdown needs ALL venues, so allItemsPaging (default paging is 10 per page)
    this.venuesApi
      .list({ paging: allItemsPaging })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.venues = response.items;
        },
        error: (err) => {
          this.toaster.error(this.translate.instant('VENUES.DIALOGS.ERROR_LOAD_LIST'));
          console.error('Load venues error:', err);
        }
      });
  }

  private loadSector(id: number): void {
    this.isLoading = true;

    this.api.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (sector) => {
        this.form = this.formService.createSectorForm(sector);
        this.isLoading = false;
      },
      error: (err) => {
        this.toaster.error(this.translate.instant('SECTORS.DIALOGS.ERROR_LOAD'));
        console.error('Load sector error:', err);
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

    if (this.isEditMode && this.data.sectorId) {
      this.updateSector(this.form);
    } else {
      this.createSector(this.form);
    }
  }

  private createSector(form: FormGroup<SectorForm>): void {
    const command: CreateSectorCommand = {
      name: form.controls.name.value.trim(),
      venueId: form.controls.venueId.value!,
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
        console.error('Create sector error:', err);
      }
    });
  }

  private updateSector(form: FormGroup<SectorForm>): void {
    const command: UpdateSectorCommand = {
      name: form.controls.name.value.trim(),
      venueId: form.controls.venueId.value!,
      isEnabled: form.controls.isEnabled.value
    };

    this.api.update(this.data.sectorId!, command).subscribe({
      next: () => {
        this.dialogRef.close(true); // signal success (the list shows the message)
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = applyServerErrors(form, err);
        console.error('Update sector error:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}