import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('mfList/ListModule').then((m)=> m.ListModule),
  },
  {
    path: 'hero',
    loadComponent: () =>
      import('mfItem/ItemComponent').then((c) => c.ItemComponent),
  },
  {
    path: 'hero/:id',
    loadComponent: () =>
      import('mfItem/ItemComponent').then((c) => c.ItemComponent),
  },
];
