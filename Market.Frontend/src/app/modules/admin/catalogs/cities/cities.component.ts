import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { CitiesApiService } from '../../../../api-services/cities/cities-api.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import {
  ListCitiesRequest,
  ListCitiesQueryDto,
} from '../../../../api-services/cities/cities-api.model';
import { CityUpsertComponent } from './city-upsert/city-upsert.component';

@Component({
  selector: 'app-cities',
  standalone: false,
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
})
export class CitiesComponent
  extends BaseListPagedComponent<ListCitiesQueryDto, ListCitiesRequest>
  implements OnInit
{
  private api = inject(CitiesApiService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);
  private translate = inject(TranslateService);

  displayedColumns: string[] = ['name', 'isEnabled', 'actions'];
  showOnlyEnabled = true;

  constructor() {
    super();
    this.request = new ListCitiesRequest();
    this.request.onlyEnabled = true;
  }

  ngOnInit(): void {
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
        this.stopLoading(this.translate.instant('CITIES.DIALOGS.ERROR_LOAD_LIST'));
        console.error('Load cities error:', err);
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

  // === CRUD Actions ===

  onCreate(): void {
    const dialogRef = this.dialog.open(CityUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'city-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.city.showCreateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onEdit(city: ListCitiesQueryDto): void {
    const dialogRef = this.dialog.open(CityUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'city-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'edit',
        cityId: city.id,
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.city.showUpdateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onDelete(city: ListCitiesQueryDto): void {
    this.dialogHelper.city.confirmDelete(city.name).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(city);
      }
    });
  }

  private performDelete(city: ListCitiesQueryDto): void {
    this.startLoading();

    this.api.delete(city.id).subscribe({
      next: () => {
        this.dialogHelper.city.showDeleteSuccess().subscribe();
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        // Show error dialog instead of toast
        this.dialogHelper.showError(
          'DIALOGS.TITLES.ERROR',
          'CITIES.DIALOGS.ERROR_DELETE'
        ).subscribe();

        console.error('Delete city error:', err);
      },
    });
  }

  onToggleStatus(city: ListCitiesQueryDto): void {
    this.startLoading();

    const apiAction = city.isEnabled
      ? this.api.disable(city.id)
      : this.api.enable(city.id);

    apiAction.subscribe({
      next: () => {
        const messageKey = city.isEnabled
          ? 'CITIES.DIALOGS.SUCCESS_DISABLE'
          : 'CITIES.DIALOGS.SUCCESS_ENABLE';
        this.toaster.success(this.translate.instant(messageKey, { name: city.name }));
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        if (err.status === 409) {
          // Business rule conflict - show dialog for important errors
          this.dialogHelper.showWarning(
            'DIALOGS.TITLES.WARNING',
            errorMessage || 'CITIES.DIALOGS.ERROR_TOGGLE',
            { name: city.name }
          ).subscribe();
        } else {
          // Generic error - just toast
          this.toaster.error(
            errorMessage ||
              this.translate.instant('CITIES.DIALOGS.ERROR_TOGGLE', { name: city.name })
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
