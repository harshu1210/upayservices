import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8080/api/upayServices/order/';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getOrderList(page: number, size: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}getOrders`, { params: { page: page.toString(), size: size.toString() }, headers: headers });
  }

  getPackages() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}getPackages`, { headers: headers });
  }

  updateOrder(element: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.put(`${this.baseUrl}updatOrder`, element, { headers: headers });
  }

  createOrder(orderDTO: any, files: File[]): Observable<any> {
    const token = this.storageService.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Prepare FormData
    const formData = new FormData();
    // Append the JSON stringified orderDTO as a param 'orderDTO'
    formData.append('orderDTO', JSON.stringify(orderDTO));

    // Append each file
    if (files && files.length) {
      files.forEach(file => {
        formData.append('files', file, file.name);
      });
    }

    // POST request with multipart/form-data
    return this.http.post(`${this.baseUrl}createOrder`, formData, { headers });
  }


  deleteOrder(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storageService.getItem('token')}`
    });
    return this.http.delete(`${this.baseUrl}deleteOrderByID/${id}`, { headers: headers });
  }
}
