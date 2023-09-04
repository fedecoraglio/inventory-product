import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ColorDto, ColorListDto } from '@features/color/types/color.types';

@Injectable({
  providedIn: 'root',
})
export class ColorApiService {
  private readonly http = inject(HttpClient);
  private basePath = environment.apiUrl + 'v1/colors';

  getById$(id: string): Observable<ColorDto> {
    return this.http.get<ColorDto>(`${this.basePath}/${id}`);
  }

  getAll$(): Observable<ColorListDto> {
    return this.http.get<ColorListDto>(this.basePath);
  }

  save$(dto: ColorDto): Observable<ColorDto> {
    return this.http.post<ColorDto>(this.basePath, { ...dto });
  }

  update$(id: string, dto: ColorDto): Observable<ColorDto> {
    return this.http.put<ColorDto>(`${this.basePath}/${id}`, { ...dto });
  }

  delete$(id: string): Observable<ColorDto> {
    return this.http.delete<ColorDto>(`${this.basePath}/${id}`);
  }
}
