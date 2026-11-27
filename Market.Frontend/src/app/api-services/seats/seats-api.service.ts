import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListSeatsRequest,
  ListSeatsResponse,
  GetSeatByIdQueryDto,
  CreateSeatCommand,
  UpdateSeatCommand,
  GenerateSeatsCommand
} from './seats-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';
import { CreatedResponse } from '../../core/models/created-response';

@Injectable({
  providedIn: 'root',
})
export class SeatsApiService {
  private readonly baseUrl = `${environment.apiUrl}/Seats`;
  private http = inject(HttpClient);

  /**
   * GET /Seats
   * List seats with optional query parameters.
   */
  list(request?: ListSeatsRequest): Observable<ListSeatsResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListSeatsResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /Seats/{id}
   * Get a single seat by ID.
   */
  getById(id: number): Observable<GetSeatByIdQueryDto> {
    return this.http.get<GetSeatByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /Seats
   * Create a new seat.
   * @returns { id } of the newly created seat
   */
  create(payload: CreateSeatCommand): Observable<CreatedResponse> {
    return this.http.post<CreatedResponse>(this.baseUrl, payload);
  }

  /**
   * POST /Seats/generate
   * Create seats for several rows at once (one transaction).
   * @returns the number of created seats
   */
  generate(payload: GenerateSeatsCommand): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/generate`, payload);
  }

  /**
   * PUT /Seats/{id}
   * Update an existing seat.
   */
  update(id: number, payload: UpdateSeatCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /Seats/{id}
   * Delete a seat.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /Seats/{id}/disable
   * Disable a seat.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /Seats/{id}/enable
   * Enable a seat.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}