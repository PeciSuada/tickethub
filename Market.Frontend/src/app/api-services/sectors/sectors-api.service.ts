import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListSectorsRequest,
  ListSectorsResponse,
  GetSectorByIdQueryDto,
  CreateSectorCommand,
  UpdateSectorCommand
} from './sectors-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';
import { CreatedResponse } from '../../core/models/created-response';

@Injectable({
  providedIn: 'root',
})
export class SectorsApiService {
  private readonly baseUrl = `${environment.apiUrl}/Sectors`;
  private http = inject(HttpClient);

  /**
   * GET /Sectors
   * List sectors with optional query parameters.
   */
  list(request?: ListSectorsRequest): Observable<ListSectorsResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListSectorsResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /Sectors/{id}
   * Get a single sector by ID.
   */
  getById(id: number): Observable<GetSectorByIdQueryDto> {
    return this.http.get<GetSectorByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /Sectors
   * Create a new sector.
   * @returns { id } of the newly created sector
   */
  create(payload: CreateSectorCommand): Observable<CreatedResponse> {
    return this.http.post<CreatedResponse>(this.baseUrl, payload);
  }

  /**
   * PUT /Sectors/{id}
   * Update an existing sector.
   */
  update(id: number, payload: UpdateSectorCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /Sectors/{id}
   * Delete a sector.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /Sectors/{id}/disable
   * Disable a sector.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /Sectors/{id}/enable
   * Enable a sector.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}
