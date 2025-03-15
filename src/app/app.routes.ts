import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'Home',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes),
        canActivate: [AuthGuard],
      },
      {
        path: 'base/tabs/add', // Route for Add submenu
        loadComponent: () =>
          import('./views/base/tabs/Add Collection/add-collection/add-collection.component').then(
            (m) => m.AddCollectionComponent
          ),
        data: {
          title: 'Add Collection',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'base/tabs/view', // Route for View submenu
        loadComponent: () =>
          import('./views/base/tabs/View Collection/view-collection/view-collection.component').then(
            (m) => m.ViewCollectionComponent
          ),
        data: {
          title: 'View Collection',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'base/tabs/report', // Route for View submenu
        loadComponent: () =>
          import('./views/base/tabs/Reports/report/report.component').then(
            (m) => m.ReportComponent
          ),
        data: {
          title: 'Report',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'base/tabs/department',
        loadComponent: () =>
          import('./views/base/tabs/Masters/department/department.component').then(
            (m) => m.DepartmentComponent
          ),
        data: {
          title: 'Department Page',
        },
        canActivate: [AuthGuard],
      },
           {
        path: 'base/tabs/investigation', // Route for investigation submenu
        loadComponent: () =>
          import('./views/base/tabs/Masters/investigation/investigation.component').then(
            (m) => m.InvestigationComponent
          ),
        data: {
          title: 'Investigation Page',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'base/tabs/antibiotic', // Route for investigation submenu
        loadComponent: () =>
          import('./views/base/tabs/Masters/antibiotic/antibiotic.component').then(
            (m) => m.AntibioticComponent
          ),
        data: {
          title: 'Antibiotic Page',
        },
        canActivate: [AuthGuard],
      },
    ],
  },

  
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },

  // {
  //   path: 'department',
  //   loadComponent: () =>
  //     import('./views/base/tabs/Masters/department/department.component').then(
  //       (m) => m.DepartmentComponent
  //     ),
  //   data: {
  //     title: 'Deprtment Page',
  //   },
  //   // canActivate: [AuthGuard],
  // },

  { path: '**', redirectTo: 'login' },
];
