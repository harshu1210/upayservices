import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storageChangeSubject = new Subject<{ key: string; value: any }>();
  public storageChanged$ = this.storageChangeSubject.asObservable();

  constructor() {
    // Listen for cross-tab storage changes
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        this.storageChangeSubject.next({ key: event.key!, value: event.newValue });
      }
    });
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.storageChangeSubject.next({ key, value }); // Emit change for same-tab
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
    this.storageChangeSubject.next({ key, value: null }); // Emit change
  }

  extractToken() {
    let token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<any>(token);
      return decoded.sub;
    }
  }
}
