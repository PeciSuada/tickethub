import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListEventCategoriesRequest,
  ListEventCategoriesResponse,
  GetEventCategoryByIdQueryDto,
  CreateEventCategoryCommand,
  UpdateEventCategoryCommand
} from './event-categories-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';
import { CreatedResponse } from '../../core/models/created-response';

@Injectable({
  providedIn: 'root',
})
export class EventCategoriesApiService {
  private readonly baseUrl = `${environment.apiUrl}/EventCategories`;
  private http = inject(HttpClient);

  /**
   * GET /EventCategories
   * List categories with optional query parameters.
   */
  list(request?: ListEventCategoriesRequest): Observable<ListEventCategoriesResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListEventCategoriesResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /EventCategories/{id}
   * Get a single category by ID.
   */
  getById(id: number): Observable<GetEventCategoryByIdQueryDto> {
    return this.http.get<GetEventCategoryByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /EventCategories
   * Create a new category.
   * @returns { id } of the newly created category
   */
  create(payload: CreateEventCategoryCommand): Observable<CreatedResponse> {
    return this.http.post<CreatedResponse>(this.baseUrl, payload);
  }

  /**
   * PUT /EventCategories/{id}
   * Update an existing category.
   */
  update(id: number, payload: UpdateEventCategoryCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /EventCategories/{id}
   * Delete a category.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /EventCategories/{id}/disable
   * Disable a category.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /EventCategories/{id}/enable
   * Enable a category.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}
