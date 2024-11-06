/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurrencyResolverService } from './CurrencyResolver.service';

describe('Service: CurrencyResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyResolverService]
    });
  });

  it('should ...', inject([CurrencyResolverService], (service: CurrencyResolverService) => {
    expect(service).toBeTruthy();
  }));
});
