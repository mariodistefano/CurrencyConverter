import { ExchangeRateService } from './../exchange-rate.service';
import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CurrencyResolverService implements Resolve<any> {
  exchangeRateService = inject(ExchangeRateService);
  constructor() {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.exchangeRateService.getRatesDefault();
  }
}
