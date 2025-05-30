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

  getServices() {
    return this.http.get(`${this.baseUrl}services`);
  }

  updateService(element: any, id: number) {
    return this.http.put(`${this.baseUrl}updateById`, element, { params: { id: id } });
  }

  createService(element: any) {
    return this.http.post(`${this.baseUrl}createService`, element);
  }

  deleteServices(id: number) {
    return this.http.delete(`${this.baseUrl}deleteById/${id}`);
  }
}
