import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import * as moment from 'moment';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateComponent),
            multi: true
        }
    ]
})

export class DateComponent implements OnInit, ControlValueAccessor {
    days: SelectItem[];
    months: SelectItem[];
    years: SelectItem[];
    value: string;
    onChange: (value: string) => void;
    onTouch: () => void;
    isDisabled: boolean;
    year: FormControl;
    month: FormControl;
    day: FormControl;

    constructor(private _formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.buildFormDate();
        this.generateYears();
        this.generateMonths();
        this.generateDays(31);
    }

    buildFormDate() {
        this.year = this._formBuilder.control('', Validators.required);
        this.month = this._formBuilder.control('', Validators.required);
        this.day = this._formBuilder.control('', Validators.required);
    }

    generateDays(totalDays: number) {
        this.days = [];
        for (let i = 1; i <= totalDays; i++) {
            this.days.push({label: (i < 10 ? '0' : '') + i, value: (i < 10 ? '0' : '') + i});
        }
    }

    generateMonths() {
        this.months = [];
        for (let i = 1; i <= 12; i++) {
            this.months.push({label: i.toString(), value: (i < 10 ? '0' : '') + i});
        }
    }

    generateYears() {
        this.years = [];
        const currentYear = parseInt(moment().format('YYYY'));
        for (let i = currentYear+1; i >= (currentYear - 100); i--) {
            this.years.push({label: i.toString(), value: i.toString()});
        }
    }

    calculateTotalDays() {
        if (this.month.valid) {
            switch (this.month.value) {
                case '01':
                    this.generateDays(31);
                    break;
                case '02':
                    this.generateDays(this.validateLeapYear(this.year.value) ? 29 : 28);
                    break;
                case '03':
                    this.generateDays(31);
                    break;
                case '04':
                    this.generateDays(30);
                    break;
                case '05':
                    this.generateDays(31);
                    break;
                case '06':
                    this.generateDays(30);
                    break;
                case '07':
                    this.generateDays(31);
                    break;
                case '08':
                    this.generateDays(31);
                    break;
                case '09':
                    this.generateDays(30);
                    break;
                case '10':
                    this.generateDays(31);
                    break;
                case '11':
                    this.generateDays(30);
                    break;
                case '12':
                    this.generateDays(31);
                    break;
            }
        }
    }

    validateLeapYear(year: string) {
        console.log(year);
        if (year === '' || year === null) {
            return false;
        }
        const yearInt = parseInt(year);
        return ((yearInt % 4 == 0) && (yearInt % 100 != 0)) || (yearInt % 400 == 0);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(value: string): void {
        this.value = value;
        if (this.value) {
            const [year, month, day] = this.value.split('-');
            this.year.setValue(year);
            this.month.setValue(month);
            this.day.setValue(day);
        }
    }

    updateValue(): void {
        if (this.year.valid && this.month.valid && this.day.valid) {
            this.value = `${this.year.value}-${this.month.value}-${this.day.value}`
            this.onChange(this.value);
        }
    }
}
