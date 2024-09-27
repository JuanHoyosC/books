import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then((m) => m.SigninPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then((m) => m.SignupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
