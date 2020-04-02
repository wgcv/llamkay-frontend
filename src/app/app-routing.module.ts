import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';

import { UserListComponent } from './pages/user-list/user-list.component';
import { SigninComponent } from './pages/signin/signin.component';

import { AuthGuard } from './guards/auth.guards';
import { UserEditComponent } from './pages/user-edit/user-edit.component';

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
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { title: 'Lista de usuario' }
  },
  {
    path: 'user/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard],
    data: { title: 'Detalle de usuario' }
  },
  {
    path: 'user/edit/:id',
    component: UserEditComponent,
    canActivate: [AuthGuard],
    data: { title: 'Editar de usuario' }
  },
  {
    path: 'downloads',
    component: DownloadsComponent,
    data: { title: 'Descargar' }
  },
  {
    path: 'task/:id',
    component: TaskDetailComponent,
    canActivate: [AuthGuard],
    data: { title: 'Lista de usuario' }
  },
  {
    path: 'recovery-password',
    component: RecoveryPasswordComponent,
    data: { title: 'Asignar contraseña' }
  },
  
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
