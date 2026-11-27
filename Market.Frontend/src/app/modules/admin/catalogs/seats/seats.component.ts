import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { SeatsApiService } from '../../../../api-services/seats/seats-api.service';
import { SectorsApiService } from '../../../../api-services/sectors/sectors-api.service';
import { ListSectorsQueryDto } from '../../../../api-services/sectors/sectors-api.model';
import { SeatCategoriesApiService } from '../../../../api-services/seat-categories/seat-categories-api.service';
import { ListSeatCategoriesQueryDto } from '../../../../api-services/seat-categories/seat-categories-api.model';
import { SeatGenerateComponent } from './seat-generate/seat-generate.component';
import { allItemsPaging } from '../../../../core/models/paging/paging-utils';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import {
  ListSeatsRequest,
  ListSeatsQueryDto,
} from '../../../../api-services/seats/seats-api.model';
import { SeatUpsertComponent } from './seat-upsert/seat-upsert.component';

@Component({
  selector: 'app-seats',
  standalone: false,
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.scss',
})
export class SeatsComponent
  extends BaseListPagedComponent<ListSeatsQueryDto, ListSeatsRequest>
  implements OnInit
{
  private api = inject(SeatsApiService);
  private sectorsApi = inject(SectorsApiService);
  private seatCategoriesApi = inject(SeatCategoriesApiService);
  private matDialog = inject(MatDialog);

  sectors: ListSectorsQueryDto[] = [];
  seatCategories: ListSeatCategoriesQueryDto[] = [];
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);
  private translate = inject(TranslateService);

  displayedColumns: string[] = ['name', 'sector', 'category', 'isEnabled', 'actions'];
  showOnlyEnabled = true;

  constructor() {
    super();
    this.request = new ListSeatsRequest();
    this.request.onlyEnabled = true;
  }

  ngOnInit(): void {
    this.loadFilters();
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
        this.stopLoading(this.translate.instant('SEATS.DIALOGS.ERROR_LOAD_LIST'));
        console.error('Load seats error:', err);
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

  private loadFilters(): void {
    this.sectorsApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.sectors = response.items;
      },
      error: (err) => {
        console.error('Load sectors error:', err);
      },
    });

    this.seatCategoriesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.seatCategories = response.items;
      },
      error: (err) => {
        console.error('Load seat categories error:', err);
      },
    });
  }

  onSectorChange(sectorId: number | null): void {
    this.request.sectorId = sectorId;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onCategoryChange(seatCategoryId: number | null): void {
    this.request.seatCategoryId = seatCategoryId;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  /** Opens the bulk generator (rows x seats per row); the list reloads when seats were created. */
  onGenerate(): void {
    this.matDialog
      .open(SeatGenerateComponent, { width: '560px', disableClose: true })
      .afterClosed()
      .subscribe((created: boolean) => {
        if (created) {
          this.loadPagedData();
        }
      });
  }

  // === CRUD Actions ===

  onCreate(): void {
    const dialogRef = this.dialog.open(SeatUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'seat-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.seat.showCreateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onEdit(seat: ListSeatsQueryDto): void {
    const dialogRef = this.dialog.open(SeatUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'seat-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'edit',
        seatId: seat.id,
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.seat.showUpdateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onDelete(seat: ListSeatsQueryDto): void {
    this.dialogHelper.seat.confirmDelete(seat.name).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(seat);
      }
    });
  }

  private performDelete(seat: ListSeatsQueryDto): void {
    this.startLoading();

    this.api.delete(seat.id).subscribe({
      next: () => {
        this.dialogHelper.seat.showDeleteSuccess().subscribe();
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        // Show error dialog instead of toast
        this.dialogHelper.showError(
          'DIALOGS.TITLES.ERROR',
          'SEATS.DIALOGS.ERROR_DELETE'
        ).subscribe();

        console.error('Delete seat error:', err);
      },
    });
  }

  onToggleStatus(seat: ListSeatsQueryDto): void {
    this.startLoading();

    const apiAction = seat.isEnabled
      ? this.api.disable(seat.id)
      : this.api.enable(seat.id);

    apiAction.subscribe({
      next: () => {
        const messageKey = seat.isEnabled
          ? 'SEATS.DIALOGS.SUCCESS_DISABLE'
          : 'SEATS.DIALOGS.SUCCESS_ENABLE';
        this.toaster.success(this.translate.instant(messageKey, { name: seat.name }));
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        if (err.status === 409) {
          // Business rule conflict - show dialog for important errors
          this.dialogHelper.showWarning(
            'DIALOGS.TITLES.WARNING',
            errorMessage || 'SEATS.DIALOGS.ERROR_TOGGLE',
            { name: seat.name }
          ).subscribe();
        } else {
          // Generic error - just toast
          this.toaster.error(
            errorMessage ||
              this.translate.instant('SEATS.DIALOGS.ERROR_TOGGLE', { name: seat.name })
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
