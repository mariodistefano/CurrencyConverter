import { Routes } from '@angular/router';
import ConverterComponent from './pages/converterPage/converter/converter.component';
import { CurrencyResolverService } from './services/resolver/CurrencyResolver.service';

export const routes: Routes = [
  {
    path: '',
    component: ConverterComponent,
    resolve: { exchangeRates: CurrencyResolverService },
  },
  { path: '**', redirectTo: '' },
];
