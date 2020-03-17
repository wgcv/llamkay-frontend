import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserAddComponent } from './pages/user-add/user-add.component';

import { UserListComponent } from './pages/user-list/user-list.component';
import { SigninComponent } from './pages/signin/signin.component';

import { AuthGuard } from './guards/auth.guards';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Inicio' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Ingresar' }
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: { title: 'Registrarse' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Panel de control' }
  },
  {
    path: 'user/add',
    component: UserAddComponent,
    canActivate: [AuthGuard],
    data: { title: 'Agregar nuevo usuario' }
  },
  {
    path: 'user/list',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { title: 'Lista de usuario' }
  },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
