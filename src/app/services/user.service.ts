import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/upayServices/users/';

  constructor(private http: HttpClient) { }

  getUsersList(page: number, size: number) {
    return this.http.get(`${this.baseUrl}getUser`, { params: { page: page.toString(), size: size.toString() } });
  }

  getCustomerList(page: number, size: number) {
    return this.http.get(`${this.baseUrl}getCustomer`, { params: { page: page.toString(), size: size.toString() } });
  }

  updateUser(element: any) {
    return this.http.put(`${this.baseUrl}updateUser`, element);
  }

  createUser(element: any) {
    return this.http.post(`${this.baseUrl}createUser`, element);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}deleteById/${id}`);
  }

  loginUser(element: any) {
    return this.http.post(`${this.baseUrl}login`, element);
  }

  forgotUser(element: any) {
    return this.http.put(`${this.baseUrl}forgotUser`, element);
  }

}
