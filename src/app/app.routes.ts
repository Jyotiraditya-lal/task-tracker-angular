import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { loginGuard } from './guard/login.guard';

export const routes: Routes = [

  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.loginComponent), canActivate: [loginGuard] },
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuard] },
  { path: 'all-tasks', loadComponent: () => import('./components/all-tasks/all-tasks.component').then(m => m.AllTasksComponent), canActivate: [AuthGuard] },
  { path: 'my-tasks', loadComponent: () => import('./components/my-tasks/my-tasks.component').then(m => m.MyTaskComponent), canActivate: [AuthGuard] },
  { path: 'closed-tasks', loadComponent: () => import('./components/closed-tasks/closed-tasks.component').then(m => m.ClosedTaskComponent), canActivate: [AuthGuard] },
  { path: '**', loadComponent: () => import('./components/404-not-found/not-Found.component').then(m => m.NotFoundComponent), canActivate: [AuthGuard] }
];
