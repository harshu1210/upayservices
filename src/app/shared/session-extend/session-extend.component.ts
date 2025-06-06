import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
    selector: 'app-session-extend',
    templateUrl: './session-extend.component.html',
    styleUrls: ['./session-extend.component.css'],
    standalone: false
})
export class SessionExtendComponent implements OnInit {

 constructor(public dialogRef: MatDialogRef<SessionExtendComponent>) {}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
