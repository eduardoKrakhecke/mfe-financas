import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { MFE_FINANCAS_ROUTES } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(MFE_FINANCAS_ROUTES),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    }
  ],

};
