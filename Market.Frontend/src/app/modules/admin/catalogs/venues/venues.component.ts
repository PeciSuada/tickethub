import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { VenuesApiService } from '../../../../api-services/venues/venues-api.service';
import { CitiesApiService } from '../../../../api-services/cities/cities-api.service';
import { ListCitiesQueryDto } from '../../../../api-services/cities/cities-api.model';
import { allItemsPaging } from '../../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import {
  ListVenuesRequest,
  ListVenuesQueryDto,
} from '../../../../api-services/venues/venues-api.model';
import { VenueUpsertComponent } from './venue-upsert/venue-upsert.component';

@Component({
  selector: 'app-venues',
  standalone: false,
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.scss',
})
export class VenuesComponent
  extends BaseListPagedComponent<ListVenuesQueryDto, ListVenuesRequest>
  implements OnInit
{
  private api = inject(VenuesApiService);
  private citiesApi = inject(CitiesApiService);

  cities: ListCitiesQueryDto[] = [];
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);
  private translate = inject(TranslateService);

  displayedColumns: string[] = ['name', 'address', 'city', 'isEnabled', 'actions'];
  showOnlyEnabled = true;

  constructor() {
    super();
    this.request = new ListVenuesRequest();
    this.request.onlyEnabled = true;
  }

  ngOnInit(): void {
    this.loadCities();
    this.initList();
  }

  protected loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading(this.translate.instant('VENUES.DIALOGS.ERROR_LOAD_LIST'));
        console.error('Load venues error:', err);
      },
    });
  }

  // === Filters ===

  onSearchChange(searchTerm: string): void {
    this.request.search = searchTerm;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onToggleEnabledFilter(checked: boolean): void {
    this.showOnlyEnabled = checked;
    this.request.onlyEnabled = checked;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  private loadCities(): void {
    this.citiesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.cities = response.items;
      },
      error: (err) => {
        console.error('Load cities error:', err);
      },
    });
  }

  onCityChange(cityId: number | null): void {
    this.request.cityId = cityId;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  // === CRUD Actions ===

  onCreate(): void {
    const dialogRef = this.dialog.open(VenueUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'venue-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.venue.showCreateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onEdit(venue: ListVenuesQueryDto): void {
    const dialogRef = this.dialog.open(VenueUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'venue-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'edit',
        venueId: venue.id,
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.venue.showUpdateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onDelete(venue: ListVenuesQueryDto): void {
    this.dialogHelper.venue.confirmDelete(venue.name).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(venue);
      }
    });
  }

  private performDelete(venue: ListVenuesQueryDto): void {
    this.startLoading();

    this.api.delete(venue.id).subscribe({
      next: () => {
        this.dialogHelper.venue.showDeleteSuccess().subscribe();
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        // Show error dialog instead of toast
        this.dialogHelper.showError(
          'DIALOGS.TITLES.ERROR',
          'VENUES.DIALOGS.ERROR_DELETE'
        ).subscribe();

        console.error('Delete venue error:', err);
      },
    });
  }

  onToggleStatus(venue: ListVenuesQueryDto): void {
    this.startLoading();

    const apiAction = venue.isEnabled
      ? this.api.disable(venue.id)
      : this.api.enable(venue.id);

    apiAction.subscribe({
      next: () => {
        const messageKey = venue.isEnabled
          ? 'VENUES.DIALOGS.SUCCESS_DISABLE'
          : 'VENUES.DIALOGS.SUCCESS_ENABLE';
        this.toaster.success(this.translate.instant(messageKey, { name: venue.name }));
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        if (err.status === 409) {
          // Business rule conflict - show dialog for important errors
          this.dialogHelper.showWarning(
            'DIALOGS.TITLES.WARNING',
            errorMessage || 'VENUES.DIALOGS.ERROR_TOGGLE',
            { name: venue.name }
          ).subscribe();
        } else {
          // Generic error - just toast
          this.toaster.error(
            errorMessage ||
              this.translate.instant('VENUES.DIALOGS.ERROR_TOGGLE', { name: venue.name })
          );
        }

        console.error('Toggle status error:', err);
        this.loadPagedData();
      },
    });
  }

  /**
   * Extract user-friendly error message from HTTP error response
   */
  private extractErrorMessage(err: any): string | null {
    if (err?.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }

      if (err.error.message) {
        return err.error.message;
      }

      if (err.error.title) {
        return err.error.title;
      }

      if (err.error.errors && typeof err.error.errors === 'object') {
        const errors = Object.values(err.error.errors).flat();
        if (errors.length > 0) {
          return errors.join(', ');
        }
      }
    }

    if (err?.message) {
      return err.message;
    }

    if (err?.statusText && err.statusText !== 'Unknown Error') {
      return err.statusText;
    }

    return null;
  }
}
