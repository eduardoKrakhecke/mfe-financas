import { Routes } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

export const MFE_FINANCAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/financas/financas.component').then(m => m.FinancasComponent),
  },
];
