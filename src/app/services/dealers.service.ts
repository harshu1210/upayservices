import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DealersService {

  private baseUrl = 'http://localhost:8080/api/upayServices/dealers/';

  constructor(private http: HttpClient) { }

  getDealersList(page: number, size: number) {
    return this.http.get(`${this.baseUrl}getDealers`, { params: { page: page.toString(), size: size.toString() } });
  }

  updateDealer(element: any) {
    return this.http.put(`${this.baseUrl}updateDealer`, element);
  }

  createDealer(element: any) {
    return this.http.post(`${this.baseUrl}createDealer`, element);
  }

  deleteDealer(id: number) {
    return this.http.delete(`${this.baseUrl}deleteById/${id}`);
  }
}
