import { Routes } from '@angular/router';

export const MFE_FINANCAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/financas/financas.component')
        .then(m => m.FinancasComponent),
  },
];
