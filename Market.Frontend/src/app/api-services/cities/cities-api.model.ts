import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /Cities
 * Corresponds to: ListCitiesQuery.cs
 */
export class ListCitiesRequest extends BasePagedQuery {
  search?: string | null;
  onlyEnabled?: boolean | null;
}

/**
 * Response item for GET /Cities
 * Corresponds to: ListCitiesQueryDto.cs
 */
export interface ListCitiesQueryDto {
  id: number;
  name: string;
  isEnabled: boolean;
}

/**
 * Response for GET /Cities/{id}
 * Corresponds to: GetCityByIdQueryDto.cs
 */
export interface GetCityByIdQueryDto {
  id: number;
  name: string;
  isEnabled: boolean;
}

/**
 * Paged response for GET /Cities
 */
export type ListCitiesResponse = PageResult<ListCitiesQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /Cities
 * Corresponds to: CreateCityCommand.cs
 */
export interface CreateCityCommand {
  name: string;
  isEnabled: boolean;
}

/**
 * Command for PUT /Cities/{id}
 * Corresponds to: UpdateCityCommand.cs
 */
export interface UpdateCityCommand {
  name: string;
  isEnabled: boolean;
}
