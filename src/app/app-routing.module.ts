import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerComponent } from './components/dealer/dealer.component';
import { ServicesComponent } from './components/services/services.component';
import { WildCardComponent } from './shared/wild-card/wild-card.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'userPage', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dealerPage', component: DealerComponent },
  { path: 'servicePage', component: ServicesComponent },
  { path: '**', component: WildCardComponent } // wildcard for unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
