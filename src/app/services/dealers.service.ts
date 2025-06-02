import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DealersService {

  private baseUrl = 'http://localhost:8080/api/upayServices/dealers/';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getDealersList(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}getDealers`, { params: { page: page.toString(), size: size.toString() }, headers: headers });
  }

  getDealersCompanyName() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}getDealersCompanyName`, { headers: headers });
  }

  updateDealer(element: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.put(`${this.baseUrl}updateDealer`, element, { headers: headers });
  }

  createDealer(element: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.post(`${this.baseUrl}createDealer`, element, { headers: headers });
  }

  deleteDealer(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.delete(`${this.baseUrl}deleteById/${id}`, { headers: headers });
  }
}
