import { Directive, HostListener } from "@angular/core";
import { NgControl, NgModel } from "@angular/forms";
import { CurrencyPipe, DecimalPipe } from "@angular/common";

@Directive({
  selector: "[appCurrencyI18n]",
  providers: [NgModel, CurrencyPipe, DecimalPipe],
  host: {
    "(blur)": "onInputChange($event)"
  }
})
export class CurrencyI18nDirective {
  constructor(
    private model: NgModel,
    private currencyPipe: CurrencyPipe,
    public ngControl: NgControl
  ) {}

  onInputChange(event:any) {
    var value = event.target.value;
    if (!value) return;

    var plainNumber: number;
    var formattedValue: any;

    var decimalSeparatorIndex = value.lastIndexOf(",");
    if (decimalSeparatorIndex > 0) {
      // if input has decimal part
      var wholeNumberPart = value.substring(0, decimalSeparatorIndex);
      var decimalPart = value.substr(decimalSeparatorIndex + 1);
      plainNumber = parseFloat(
        wholeNumberPart.replace(/[^\d]/g, "") + "." + decimalPart
      );
    } else {
      // input does not have decimal part
      plainNumber = parseFloat(value.replace(/[^\d]/g, ""));
    }

    if (!plainNumber) {
      formattedValue = "";
    } else {
      formattedValue = this.currencyPipe.transform(
        plainNumber.toFixed(2),
        "BRL",
        "symbol"
      );
    }

    this.ngControl.valueAccessor?.writeValue(formattedValue);
  }
}
