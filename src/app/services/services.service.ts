import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private baseUrl = 'http://localhost:8080/api/upayServices/services/';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getServicesList(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}servicesList`, { params: { page: page, size: size }, headers: headers });
  }

  getServices() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}services`, { headers: headers });
  }

  updateService(element: any, id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.put(`${this.baseUrl}updateById`, element, { params: { id: id }, headers: headers });
  }

  createService(element: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.post(`${this.baseUrl}createService`, element, { headers: headers });
  }

  deleteServices(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.delete(`${this.baseUrl}deleteById/${id}`, { headers: headers });
  }
}
