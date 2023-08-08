import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';

import { environment } from '../../../environments/environment.prod';
import { ProductDto, ProductListDto } from '../types/product.types';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private basePath = environment.apiUrl + 'v1/products';

  getById$(id: string): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.basePath}/${id}`);
  }

  getAll$(params: Params = null): Observable<ProductListDto> {
    console.log("params", params)
    return this.http.get<ProductListDto>(this.basePath, { params });
  }

  save$(dto: ProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.basePath, { ...dto });
  }

  update$(id: string, dto: ProductDto): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.basePath}/${id}`, { ...dto });
  }

  delete$(id: string): Observable<ProductDto> {
    return this.http.delete<ProductDto>(`${this.basePath}/${id}`);
  }
}
