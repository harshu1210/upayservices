import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/upayServices/users/';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getUsersList(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}getUser`, { params: { page: page.toString(), size: size.toString() }, headers: headers });
  }

  getCustomerList(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}getCustomer`, { params: { page: page.toString(), size: size.toString() }, headers: headers });
  }

  updateUser(element: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.put(`${this.baseUrl}updateUser`, element, { headers: headers });
  }

  createUser(element: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.post(`${this.baseUrl}createUser`, element, { headers: headers });
  }

  deleteUser(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.delete(`${this.baseUrl}deleteById/${id}`, { headers: headers });
  }

  loginUser(element: any) {
    return this.http.post(`${this.baseUrl}login`, element);
  }

  forgotUser(element: any) {
    return this.http.put(`${this.baseUrl}forgotUser`, element);
  }

}
