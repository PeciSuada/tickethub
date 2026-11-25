import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListSeatCategoriesRequest,
  ListSeatCategoriesResponse,
  GetSeatCategoryByIdQueryDto,
  CreateSeatCategoryCommand,
  UpdateSeatCategoryCommand
} from './seat-categories-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';
import { CreatedResponse } from '../../core/models/created-response';

@Injectable({
  providedIn: 'root',
})
export class SeatCategoriesApiService {
  private readonly baseUrl = `${environment.apiUrl}/SeatCategories`;
  private http = inject(HttpClient);

  /**
   * GET /SeatCategories
   * List categories with optional query parameters.
   */
  list(request?: ListSeatCategoriesRequest): Observable<ListSeatCategoriesResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListSeatCategoriesResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /SeatCategories/{id}
   * Get a single category by ID.
   */
  getById(id: number): Observable<GetSeatCategoryByIdQueryDto> {
    return this.http.get<GetSeatCategoryByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /SeatCategories
   * Create a new category.
   * @returns { id } of the newly created category
   */
  create(payload: CreateSeatCategoryCommand): Observable<CreatedResponse> {
    return this.http.post<CreatedResponse>(this.baseUrl, payload);
  }

  /**
   * PUT /SeatCategories/{id}
   * Update an existing category.
   */
  update(id: number, payload: UpdateSeatCategoryCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /SeatCategories/{id}
   * Delete a category.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /SeatCategories/{id}/disable
   * Disable a category.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /SeatCategories/{id}/enable
   * Enable a category.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}
