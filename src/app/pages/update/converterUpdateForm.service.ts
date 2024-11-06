import { Injectable } from '@angular/core';
import { FormControl, FormGroup, RequiredValidator } from '@angular/forms';

export type ConverterForm = {
  fromValue: string;
  toValue: string;
  amount: number;
} | null;
@Injectable({
  providedIn: 'root',
})
export class ConverterUpdateFormService {
  constructor() {}

  createConverterForm() {
    return new FormGroup({
      fromValue: new FormControl(),
      toValue: new FormControl(),
      amount: new FormControl(),
    });
  }

  getDefaultForm() {
    return new FormGroup({
      fromValue: new FormControl(''),
      toValue: new FormControl(''),
      amount: new FormControl(1),
    });
  }
}
