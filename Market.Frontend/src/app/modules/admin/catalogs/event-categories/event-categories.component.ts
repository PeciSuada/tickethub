import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { EventCategoriesApiService } from '../../../../api-services/event-categories/event-categories-api.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import {
  ListEventCategoriesRequest,
  ListEventCategoriesQueryDto,
} from '../../../../api-services/event-categories/event-categories-api.model';
import { EventCategoryUpsertComponent } from './event-category-upsert/event-category-upsert.component';

@Component({
  selector: 'app-event-categories',
  standalone: false,
  templateUrl: './event-categories.component.html',
  styleUrl: './event-categories.component.scss',
})
export class EventCategoriesComponent
  extends BaseListPagedComponent<ListEventCategoriesQueryDto, ListEventCategoriesRequest>
  implements OnInit
{
  private api = inject(EventCategoriesApiService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);
  private translate = inject(TranslateService);

  displayedColumns: string[] = ['name', 'isEnabled', 'actions'];
  showOnlyEnabled = true;

  constructor() {
    super();
    this.request = new ListEventCategoriesRequest();
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
        this.stopLoading(this.translate.instant('EVENT_CATEGORIES.DIALOGS.ERROR_LOAD_LIST'));
        console.error('Load categories error:', err);
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
    const dialogRef = this.dialog.open(EventCategoryUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'event-category-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.eventCategory.showCreateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onEdit(category: ListEventCategoriesQueryDto): void {
    const dialogRef = this.dialog.open(EventCategoryUpsertComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'event-category-dialog',
      autoFocus: true,
      disableClose: false,
      data: {
        mode: 'edit',
        categoryId: category.id,
      },
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialogHelper.eventCategory.showUpdateSuccess().subscribe();
        this.loadPagedData();
      }
    });
  }

  onDelete(category: ListEventCategoriesQueryDto): void {
    this.dialogHelper.eventCategory.confirmDelete(category.name).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(category);
      }
    });
  }

  private performDelete(category: ListEventCategoriesQueryDto): void {
    this.startLoading();

    this.api.delete(category.id).subscribe({
      next: () => {
        this.dialogHelper.eventCategory.showDeleteSuccess().subscribe();
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        // Show error dialog instead of toast
        this.dialogHelper.showError(
          'DIALOGS.TITLES.ERROR',
          'EVENT_CATEGORIES.DIALOGS.ERROR_DELETE'
        ).subscribe();

        console.error('Delete category error:', err);
      },
    });
  }

  onToggleStatus(category: ListEventCategoriesQueryDto): void {
    this.startLoading();

    const apiAction = category.isEnabled
      ? this.api.disable(category.id)
      : this.api.enable(category.id);

    apiAction.subscribe({
      next: () => {
        const messageKey = category.isEnabled
          ? 'EVENT_CATEGORIES.DIALOGS.SUCCESS_DISABLE'
          : 'EVENT_CATEGORIES.DIALOGS.SUCCESS_ENABLE';
        this.toaster.success(this.translate.instant(messageKey, { name: category.name }));
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        const errorMessage = this.extractErrorMessage(err);

        if (err.status === 409) {
          // Business rule conflict - show dialog for important errors
          this.dialogHelper.showWarning(
            'DIALOGS.TITLES.WARNING',
            errorMessage || 'EVENT_CATEGORIES.DIALOGS.ERROR_TOGGLE',
            { name: category.name }
          ).subscribe();
        } else {
          // Generic error - just toast
          this.toaster.error(
            errorMessage ||
              this.translate.instant('EVENT_CATEGORIES.DIALOGS.ERROR_TOGGLE', { name: category.name })
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
