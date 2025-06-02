import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formMessage: string = "Login User";
  formCreation: any[] = [
    {
      label: "User Emai", key: "email", value: '', type: 'text', validation: ['required', 'email'],
      options: [], disabled: false
    },
    {
      label: "Password", key: "passwordHash", value: '', type: 'password', validation: ['required'],
      options: [], disabled: false
    }
  ];
  token: string = "";

  constructor(private userService: UserService, private authService: AuthService, private toasterService: ToasterService, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {

  }

  submitSubmission(event: any) {
    this.userService.loginUser(event).pipe(finalize(() =>
      this.authToken()
    )).subscribe((data: any) => {
      this.token = data.auth;
      this.toasterService.success("User Logged In Successfully")
    }, (error: any) => {
      this.toasterService.error(error.message)
    })
  }

  authToken() {
    if (this.token) {
      this.authService.startSession(this.token)
      this.storageService.extractToken().includes("CUSTOMER") ? this.router.navigate(["packageTrackingPage"]) : (this.storageService.extractToken().includes("SUPERADMIN") ? this.router.navigate(["userPage"]) : this.router.navigate(["customerPage"]))
    }
  }
}
