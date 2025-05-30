import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private baseUrl = 'http://localhost:8080/api/upayServices/services/';

  constructor(private http: HttpClient) { }

  getServicesList(page: number, size: number) {
    return this.http.get(`${this.baseUrl}servicesList`, { params: { page: page, size: size } });
  }

  deleteServices(id: number) {
    return this.http.delete(`${this.baseUrl}deleteById/${id}`);
  }
}
