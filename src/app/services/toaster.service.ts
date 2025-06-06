import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private snackBar: MatSnackBar) { }

  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  error(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  info(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
