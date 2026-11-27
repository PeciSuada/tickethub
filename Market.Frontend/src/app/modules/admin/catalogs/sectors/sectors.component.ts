import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { SectorsApiService } from '../../../../api-services/sectors/sectors-api.service';
import { VenuesApiService } from '../../../../api-services/venues/venues-api.service';
import { ListVenuesQueryDto } from '../../../../api-services/venues/venues-api.model';
import { allItemsPaging } from '../../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import {
  ListSectorsRequest,
  ListSectorsQueryDto,
} from '../../../../api-services/sectors/sectors-api.model';
import { SectorUpsertComponent } from './sector-upsert/sector-upsert.component';

@Component({
  selector: 'app-sectors',
  standalone: false,
  templateUrl: './sectors.component.html',
  styleUrl: './sectors.component.scss',
})
export class SectorsComponent
  extends BaseListPagedComponent<ListSectorsQueryDto, ListSectorsRequest>
  implements OnInit
{
  private api = inject(SectorsApiService);
  private venuesApi = inject(VenuesApiService);

  venues: ListVenuesQueryDto[] = [];
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);
  private translate = inject(TranslateService);

  displayedColumns: string[] = ['name', 'venue', 'seatCount', 'isEnabled', 'actions'];
  showOnlyEnabled = true;

  constructor() {
    super();
    this.request = new ListSectorsRequest();
    this.request.onlyEnabled = true;
  }

  ngOnInit(): void {
    this.loadVenues();
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
        this.stopLoading(this.translate.instant('SECTORS.DIALOGS.ERROR_LOAD_LIST'));
        console.error('Load sectors error:', err);
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

  private loadVenues(): void {
    this.venuesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.venues = response.items;
      },
      error: (err) => {
        console.error('Load venues error:', err);
      },
    });
  }

  onVenueChange(venueId: number | null): void {
    this.request.venueId = venueId;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  // === CRUD Actions ===

  onCreate(): void {
    const dialogRef = this.dialog.open(SectorUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'sector-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.sector.showCreateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onEdit(sector: ListSectorsQueryDto): void {
    const dialogRef = this.dialog.open(SectorUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'sector-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'edit',
        sectorId: sector.id,
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.sector.showUpdateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onDelete(sector: ListSectorsQueryDto): void {
    this.dialogHelper.sector.confirmDelete(sector.name).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(sector);
      }
    });
  }

  private performDelete(sector: ListSectorsQueryDto): void {
    this.startLoading();

    this.api.delete(sector.id).subscribe({
      next: () => {
        this.dialogHelper.sector.showDeleteSuccess().subscribe();
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        // Show error dialog instead of toast
        this.dialogHelper.showError(
          'DIALOGS.TITLES.ERROR',
          'SECTORS.DIALOGS.ERROR_DELETE'
        ).subscribe();

        console.error('Delete sector error:', err);
      },
    });
  }

  onToggleStatus(sector: ListSectorsQueryDto): void {
    this.startLoading();

    const apiAction = sector.isEnabled
      ? this.api.disable(sector.id)
      : this.api.enable(sector.id);

    apiAction.subscribe({
      next: () => {
        const messageKey = sector.isEnabled
          ? 'SECTORS.DIALOGS.SUCCESS_DISABLE'
          : 'SECTORS.DIALOGS.SUCCESS_ENABLE';
        this.toaster.success(this.translate.instant(messageKey, { name: sector.name }));
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        if (err.status === 409) {
          // Business rule conflict - show dialog for important errors
          this.dialogHelper.showWarning(
            'DIALOGS.TITLES.WARNING',
            errorMessage || 'SECTORS.DIALOGS.ERROR_TOGGLE',
            { name: sector.name }
          ).subscribe();
        } else {
          // Generic error - just toast
          this.toaster.error(
            errorMessage ||
              this.translate.instant('SECTORS.DIALOGS.ERROR_TOGGLE', { name: sector.name })
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
