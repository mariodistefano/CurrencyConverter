import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';

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
      amount: new FormControl(1, [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$'),
      ]),
    });
  }
}
