import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /Seats
 * Corresponds to: ListSeatsQuery.cs
 */
export class ListSeatsRequest extends BasePagedQuery {
  /** row label contains this text */
  search?: string | null;
  sectorId?: number | null;
  seatCategoryId?: number | null;
  onlyEnabled?: boolean | null;
}

/**
 * Response item for GET /Seats
 * Corresponds to: ListSeatsQueryDto.cs
 */
export interface ListSeatsQueryDto {
  id: number;
  /** short label, e.g. "E8" */
  name: string;
  rowLabel: string;
  number: number;
  sectorId: number;
  sectorName: string;
  venueName: string;
  seatCategoryId: number;
  seatCategoryName: string;
  seatCategoryColorHex: string;
  isEnabled: boolean;
}

/**
 * Response for GET /Seats/{id}
 * Corresponds to: GetSeatByIdQueryDto.cs
 */
export interface GetSeatByIdQueryDto {
  id: number;
  name: string;
  rowLabel: string;
  number: number;
  sectorId: number;
  sectorName: string;
  seatCategoryId: number;
  seatCategoryName: string;
  isEnabled: boolean;
}

/**
 * Paged response for GET /Seats
 */
export type ListSeatsResponse = PageResult<ListSeatsQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /Seats
 * Corresponds to: CreateSeatCommand.cs
 */
export interface CreateSeatCommand {
  sectorId: number;
  seatCategoryId: number;
  rowLabel: string;
  number: number;
  isEnabled: boolean;
}

/**
 * Command for PUT /Seats/{id}
 * Corresponds to: UpdateSeatCommand.cs
 */
export interface UpdateSeatCommand {
  sectorId: number;
  seatCategoryId: number;
  rowLabel: string;
  number: number;
  isEnabled: boolean;
}

/**
 * Command for POST /Seats/generate (bulk creation, one transaction)
 * Corresponds to: GenerateSeatsCommand.cs
 */
export interface GenerateSeatsCommand {
  sectorId: number;
  seatCategoryId: number;
  /** letter of the first row, e.g. "A" */
  firstRow: string;
  rowCount: number;
  seatsPerRow: number;
}