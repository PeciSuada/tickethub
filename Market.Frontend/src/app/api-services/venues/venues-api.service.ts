import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListVenuesRequest,
  ListVenuesResponse,
  GetVenueByIdQueryDto,
  CreateVenueCommand,
  UpdateVenueCommand
} from './venues-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';
import { CreatedResponse } from '../../core/models/created-response';

@Injectable({
  providedIn: 'root',
})
export class VenuesApiService {
  private readonly baseUrl = `${environment.apiUrl}/Venues`;
  private http = inject(HttpClient);

  /**
   * GET /Venues
   * List venues with optional query parameters.
   */
  list(request?: ListVenuesRequest): Observable<ListVenuesResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListVenuesResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /Venues/{id}
   * Get a single venue by ID.
   */
  getById(id: number): Observable<GetVenueByIdQueryDto> {
    return this.http.get<GetVenueByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /Venues
   * Create a new venue.
   * @returns { id } of the newly created venue
   */
  create(payload: CreateVenueCommand): Observable<CreatedResponse> {
    return this.http.post<CreatedResponse>(this.baseUrl, payload);
  }

  /**
   * PUT /Venues/{id}
   * Update an existing venue.
   */
  update(id: number, payload: UpdateVenueCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /Venues/{id}
   * Delete a venue.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /Venues/{id}/disable
   * Disable a venue.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /Venues/{id}/enable
   * Enable a venue.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}
