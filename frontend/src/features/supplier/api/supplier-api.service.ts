import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SupplierDto, SupplierListDto } from '../types/supplier.types';

@Injectable({
  providedIn: 'root',
})
export class SupplierApiService {
  private readonly http = inject(HttpClient);
  private basePath = environment.apiUrl + 'v1/suppliers';

  getById$(id: string): Observable<SupplierDto> {
    return this.http.get<SupplierDto>(`${this.basePath}/${id}`);
  }

  getAll$(): Observable<SupplierListDto> {
    return this.http.get<SupplierListDto>(this.basePath);
  }

  save$(dto: SupplierDto): Observable<SupplierDto> {
    return this.http.post<SupplierDto>(this.basePath, { ...dto });
  }

  update$(id: string, dto: SupplierDto): Observable<SupplierDto> {
    return this.http.put<SupplierDto>(`${this.basePath}/${id}`, { ...dto });
  }

  delete$(id: string): Observable<SupplierDto> {
    return this.http.delete<SupplierDto>(`${this.basePath}/${id}`);
  }
}
