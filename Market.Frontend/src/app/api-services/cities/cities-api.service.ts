import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListCitiesRequest,
  ListCitiesResponse,
  GetCityByIdQueryDto,
  CreateCityCommand,
  UpdateCityCommand
} from './cities-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';
import { CreatedResponse } from '../../core/models/created-response';

@Injectable({
  providedIn: 'root',
})
export class CitiesApiService {
  private readonly baseUrl = `${environment.apiUrl}/Cities`;
  private http = inject(HttpClient);

  /**
   * GET /Cities
   * List cities with optional query parameters.
   */
  list(request?: ListCitiesRequest): Observable<ListCitiesResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListCitiesResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /Cities/{id}
   * Get a single city by ID.
   */
  getById(id: number): Observable<GetCityByIdQueryDto> {
    return this.http.get<GetCityByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /Cities
   * Create a new city.
   * @returns { id } of the newly created city
   */
  create(payload: CreateCityCommand): Observable<CreatedResponse> {
    return this.http.post<CreatedResponse>(this.baseUrl, payload);
  }

  /**
   * PUT /Cities/{id}
   * Update an existing city.
   */
  update(id: number, payload: UpdateCityCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /Cities/{id}
   * Delete a city.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /Cities/{id}/disable
   * Disable a city.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /Cities/{id}/enable
   * Enable a city.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}
