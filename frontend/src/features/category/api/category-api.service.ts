import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CategoryDto, CategoryListDto } from '../types/category.types';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private readonly http = inject(HttpClient);
  private basePath = 'v1/categories';

  getById$(id: string): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.basePath}/${id}`);
  }

  getAll$(): Observable<CategoryListDto> {
    return this.http.get<CategoryListDto>(this.basePath);
  }

  save$(dto: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.basePath, { ...dto });
  }

  update$(id: string, dto: CategoryDto): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(`${this.basePath}/${id}`, { ...dto });
  }

  delete$(id: string): Observable<CategoryDto> {
    return this.http.delete<CategoryDto>(`${this.basePath}/${id}`);
  }
}
