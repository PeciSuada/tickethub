import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /Venues
 * Corresponds to: ListVenuesQuery.cs
 */
export class ListVenuesRequest extends BasePagedQuery {
  search?: string | null;
  cityId?: number | null;
  onlyEnabled?: boolean | null;
}

/**
 * Response item for GET /Venues
 * Corresponds to: ListVenuesQueryDto.cs
 */
export interface ListVenuesQueryDto {
  id: number;
  name: string;
  address: string;
  cityId: number;
  cityName: string;
  isEnabled: boolean;
}

/**
 * Response for GET /Venues/{id}
 * Corresponds to: GetVenueByIdQueryDto.cs
 */
export interface GetVenueByIdQueryDto {
  id: number;
  name: string;
  address: string;
  cityId: number;
  cityName: string;
  isEnabled: boolean;
}

/**
 * Paged response for GET /Venues
 */
export type ListVenuesResponse = PageResult<ListVenuesQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /Venues
 * Corresponds to: CreateVenueCommand.cs
 */
export interface CreateVenueCommand {
  name: string;
  address: string;
  cityId: number;
  isEnabled: boolean;
}

/**
 * Command for PUT /Venues/{id}
 * Corresponds to: UpdateVenueCommand.cs
 */
export interface UpdateVenueCommand {
  name: string;
  address: string;
  cityId: number;
  isEnabled: boolean;
}