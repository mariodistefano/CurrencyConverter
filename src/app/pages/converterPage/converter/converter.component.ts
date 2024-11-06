import { ConverterUpdateFormService } from './../../update/converterUpdateForm.service';
import { Component, inject, OnInit } from '@angular/core';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { catchError, of } from 'rxjs';

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
  styleUrl: './converter.component.scss',
})
export default class ConverterComponent implements OnInit {
  rates: { [key: string]: number } = {}; // Tassi di cambio
  exchangeRates: any;
  isDataLoaded: any;

  converterUpdateFormService = inject(ConverterUpdateFormService);
  route = inject(ActivatedRoute);

  editForm!: any;

  amount: number = 1;
  convertedAmount: number | null = null;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRates = Object.keys(
      this.route.snapshot.data['exchangeRates'].conversion_rates || {}
    ).map((key) => ({
      name: key,
      value: this.route.snapshot.data['exchangeRates'].conversion_rates[key],
    }));
    this.rates = this.route.snapshot.data['exchangeRates'].conversion_rates;
    this.editForm = this.converterUpdateFormService.createConverterForm();
  }

  loadData() {
    if (!this.isDataLoaded) {
      this.exchangeRateService.getRatesDefault().subscribe((data) => {
        try {
          this.exchangeRates = Object.keys(data.conversion_rates);
          this.isDataLoaded = true;
        } catch {
          console.error('Errore durante il caricamento dei dati');
        }
      });
    }
  }

  fetchRates(): void {
    this.exchangeRateService
      .getRates(this.editForm.controls.toValue.value.name)
      .subscribe((data) => {
        this.rates = data.conversion_rates;
      });
  }

  fetchDefaultRates(): void {
    this.exchangeRates = this.exchangeRateService.getRatesDefault().pipe(
      map((data) =>
        Object.keys(data.conversion_rates || {}).map((key) => ({
          name: key,
          value: data.conversion_rates[key],
        }))
      ),
      catchError(() => of([]))
    );
  }

  convert(): void {
    if (this.rates && this.rates[this.editForm.controls.toValue.value.name]) {
      this.convertedAmount =
        this.editForm.controls.amount.value! *
        this.rates[this.editForm.controls.toValue.value.name!];
      this.fetchRates();
    } else {
      console.error(
        `Conversion rate for ${this.editForm.controls.toValue.value.name} not found.`
      );
      this.convertedAmount = null;
    }
  }
}
