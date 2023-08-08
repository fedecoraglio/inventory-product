import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';

import { environment } from '../../../environments/environment';
import { BrandDto, BrandListDto } from '@features/brand/types/brand.types';

@Injectable({
  providedIn: 'root',
})
export class BrandApiService {
  private readonly http = inject(HttpClient);
  private basePath = environment.apiUrl + 'v1/brands';

  getById$(id: string): Observable<BrandDto> {
    return this.http.get<BrandDto>(`${this.basePath}/${id}`);
  }

  getAll$(): Observable<BrandListDto> {
    return this.http.get<BrandListDto>(this.basePath);
  }

  save$(dto: BrandDto): Observable<BrandDto> {
    return this.http.post<BrandDto>(this.basePath, { ...dto });
  }

  update$(id: string, dto: BrandDto): Observable<BrandDto> {
    return this.http.put<BrandDto>(`${this.basePath}/${id}`, { ...dto });
  }

  delete$(id: string): Observable<BrandDto> {
    return this.http.delete<BrandDto>(`${this.basePath}/${id}`);
  }
}
