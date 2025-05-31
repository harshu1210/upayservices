import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-extend',
  templateUrl: './session-extend.component.html',
  styleUrls: ['./session-extend.component.css']
})
export class SessionExtendComponent implements OnInit {

 constructor(public dialogRef: MatDialogRef<SessionExtendComponent>) {}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
