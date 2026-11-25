import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /EventCategories
 * Corresponds to: ListEventCategoriesQuery.cs
 */
export class ListEventCategoriesRequest extends BasePagedQuery {
  search?: string | null;
  onlyEnabled?: boolean | null;
}

/**
 * Response item for GET /EventCategories
 * Corresponds to: ListEventCategoriesQueryDto.cs
 */
export interface ListEventCategoriesQueryDto {
  id: number;
  name: string;
  isEnabled: boolean;
}

/**
 * Response for GET /EventCategories/{id}
 * Corresponds to: GetEventCategoryByIdQueryDto.cs
 */
export interface GetEventCategoryByIdQueryDto {
  id: number;
  name: string;
  isEnabled: boolean;
}

/**
 * Paged response for GET /EventCategories
 */
export type ListEventCategoriesResponse = PageResult<ListEventCategoriesQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /EventCategories
 * Corresponds to: CreateEventCategoryCommand.cs
 */
export interface CreateEventCategoryCommand {
  name: string;
  isEnabled: boolean;
}

/**
 * Command for PUT /EventCategories/{id}
 * Corresponds to: UpdateEventCategoryCommand.cs
 */
export interface UpdateEventCategoryCommand {
  name: string;
  isEnabled: boolean;
}
