import { Component, inject, OnInit } from '@angular/core';
import { ConverterUpdateFormService } from './../../update/converterUpdateForm.service';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { map, catchError, of } from 'rxjs';

interface ExchangeRates {
  [key: string]: number;
}

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export default class ConverterComponent implements OnInit {
  rates: ExchangeRates = {};
  exchangeRates: any[] = [];
  isDataLoaded = false;

  converterUpdateFormService = inject(ConverterUpdateFormService);
  route = inject(ActivatedRoute);
  editForm = this.converterUpdateFormService.createConverterForm();

  amount: number = 1;
  convertedAmount: number | null = null;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.rates =
      this.route.snapshot.data['exchangeRates']?.conversion_rates || {};
    console.log('rates : ', this.rates);
    this.exchangeRates = Object.keys(this.rates).map((key) => ({
      name: key,
      value: this.rates[key],
    }));
  }

  loadData(): void {
    if (!this.isDataLoaded) {
      this.exchangeRateService
        .getRatesDefault()
        .pipe(
          map((data) =>
            Object.keys(data.conversion_rates).map((key) => ({
              name: key,
              value: data.conversion_rates[key],
            }))
          ),
          catchError((error) => {
            console.error('Errore durante il caricamento dei dati:', error);
            return of([]);
          })
        )
        .subscribe((data) => {
          this.exchangeRates = data;
          this.isDataLoaded = true;
        });
    }
  }

  fetchRates(): void {
    this.exchangeRateService
      .getRates(this.editForm.controls.toValue.value.name)
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch rates:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.rates = data.conversion_rates;
          console.log('Rates updated.');
        }
      });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  convert(): void {
    const fromCurrency = this.editForm.get('fromValue')!.value.name;
    const toCurrency = this.editForm.get('toValue')!.value.name;
    const amount = this.editForm.get('amount')!.value;

    if (!fromCurrency || !toCurrency || !amount || !this.rates) {
      console.error('Valori mancanti per la conversione.');
      this.convertedAmount = null;
      return;
    }

    const fromRate = this.rates[fromCurrency] || 1;
    const toRate = this.rates[toCurrency];

    if (!toRate) {
      console.error(`Tasso di conversione per ${toCurrency} non trovato.`);
      this.convertedAmount = null;
      return;
    }

    // Calcolo del valore convertito
    this.convertedAmount = (amount / fromRate) * toRate;
    console.log(`Converted Amount: ${this.convertedAmount}`);
  }
}
