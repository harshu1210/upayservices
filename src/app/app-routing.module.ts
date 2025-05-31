import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerComponent } from './components/dealer/dealer.component';
import { ServicesComponent } from './components/services/services.component';
import { WildCardComponent } from './shared/wild-card/wild-card.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerComponent } from './component/customer/customer.component';
import { OrderComponent } from './component/order/order.component';
import { PackageTrackingComponent } from './component/package-tracking/package-tracking.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: 'userPage', component: UserComponent, canActivate: [AuthService], data: { page: 'userPage' } },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dealerPage', component: DealerComponent, canActivate: [AuthService], data: { page: 'dealerPage' } },
  { path: 'servicePage', component: ServicesComponent, canActivate: [AuthService], data: { page: 'servicePage' } },
  { path: 'customerPage', component: CustomerComponent, canActivate: [AuthService], data: { page: 'customerPage' } },
  { path: 'ordersPage', component: OrderComponent, canActivate: [AuthService], data: { page: 'ordersPage' } },
  { path: 'packageTrackingPage', component: PackageTrackingComponent, canActivate: [AuthService], data: { page: 'packageTrackingPage' } },
  { path: '**', component: WildCardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
