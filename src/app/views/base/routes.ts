import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base',
    },
    children: [
      {
        path: 'tabs',
        loadComponent: () =>
          import('./tabs/tabs.component').then((m) => m.AppTabsComponent),
        data: {
          title: 'Tabs',
        },
        canActivate: [AuthGuard],
      },
    ],
  },
];
