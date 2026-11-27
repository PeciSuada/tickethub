import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /Sectors
 * Corresponds to: ListSectorsQuery.cs
 */
export class ListSectorsRequest extends BasePagedQuery {
  search?: string | null;
  venueId?: number | null;
  onlyEnabled?: boolean | null;
}

/**
 * Response item for GET /Sectors
 * Corresponds to: ListSectorsQueryDto.cs
 */
export interface ListSectorsQueryDto {
  id: number;
  name: string;
  venueId: number;
  venueName: string;
  seatCount: number;
  isEnabled: boolean;
}

/**
 * Response for GET /Sectors/{id}
 * Corresponds to: GetSectorByIdQueryDto.cs
 */
export interface GetSectorByIdQueryDto {
  id: number;
  name: string;
  venueId: number;
  venueName: string;
  isEnabled: boolean;
}

/**
 * Paged response for GET /Sectors
 */
export type ListSectorsResponse = PageResult<ListSectorsQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /Sectors
 * Corresponds to: CreateSectorCommand.cs
 */
export interface CreateSectorCommand {
  name: string;
  venueId: number;
  isEnabled: boolean;
}

/**
 * Command for PUT /Sectors/{id}
 * Corresponds to: UpdateSectorCommand.cs
 */
export interface UpdateSectorCommand {
  name: string;
  venueId: number;
  isEnabled: boolean;
}