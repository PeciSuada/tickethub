import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /SeatCategories
 * Corresponds to: ListSeatCategoriesQuery.cs
 */
export class ListSeatCategoriesRequest extends BasePagedQuery {
  search?: string | null;
  onlyEnabled?: boolean | null;
}

/**
 * Response item for GET /SeatCategories
 * Corresponds to: ListSeatCategoriesQueryDto.cs
 */
export interface ListSeatCategoriesQueryDto {
  id: number;
  name: string;
  colorHex: string;
  isEnabled: boolean;
}

/**
 * Response for GET /SeatCategories/{id}
 * Corresponds to: GetSeatCategoryByIdQueryDto.cs
 */
export interface GetSeatCategoryByIdQueryDto {
  id: number;
  name: string;
  colorHex: string;
  isEnabled: boolean;
}

/**
 * Paged response for GET /SeatCategories
 */
export type ListSeatCategoriesResponse = PageResult<ListSeatCategoriesQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /SeatCategories
 * Corresponds to: CreateSeatCategoryCommand.cs
 */
export interface CreateSeatCategoryCommand {
  name: string;
  colorHex: string;
  isEnabled: boolean;
}

/**
 * Command for PUT /SeatCategories/{id}
 * Corresponds to: UpdateSeatCategoryCommand.cs
 */
export interface UpdateSeatCategoryCommand {
  name: string;
  colorHex: string;
  isEnabled: boolean;
}