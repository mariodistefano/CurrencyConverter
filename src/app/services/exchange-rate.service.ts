import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private apiUrl =
    'https://v6.exchangerate-api.com/v6/d6e705665c28c04cd52450ba/latest';

  constructor(private http: HttpClient) {}

  getRates(base: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${base}`);
  }
  getRatesDefault(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/USD`);
  }
}
