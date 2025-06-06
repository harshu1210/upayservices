import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup, FormBuilder, FormControl,
  Validators, AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    standalone: false
})
export class FormComponent implements OnInit {

  @Input() formCreation: any[] = [];
  @Input() message: string = '';
  @Input() services: any = [];
  @Input() cancelVisible: boolean = true;
  @Input() forgotPassword: boolean = false;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;
  filteredOptions: { [key: string]: string[] } = {};
  uploadedFiles: { [key: string]: File[] } = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    const flatObject: any = {};
    for (const field of this.formCreation) {
      if (field.type === 'multiFiles' && !field.value) {
        field.value = [];
      }
      this.setNestedValue(flatObject, field.key.split('.'), field.value, field.validation, field.disabled);
    }
    this.form = this.createFormGroup(flatObject);

    for (const field of this.formCreation) {
      if (field.type === 'auto') {
        this.filteredOptions[field.key] = field.options || [];
      }
    }
  }

  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    return (control.value || '').includes(' ') ? { noSpaces: true } : null;
  }

  noCapsValidator(control: AbstractControl): ValidationErrors | null {
    return /[A-Z]/.test(control.value || '') ? { noCaps: true } : null;
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern = /^\+?[0-9\s\-()]{7,15}$/;
      return pattern.test(control.value) ? null : { invalidPhoneNumber: true };
    };
  }

  private setNestedValue(
    obj: any,
    path: string[],
    value: any,
    validations: string[],
    disabled?: boolean
  ) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = current[path[i]] || {};
      current = current[path[i]];
    }

    const control = new FormControl(
      { value, disabled: !!disabled },
      this.mapValidators(validations)
    );

    // Ensure default empty array for multiFiles if not set
    if (value === undefined && path[path.length - 1] === 'files') {
      control.setValue([]);
    }

    current[path[path.length - 1]] = control;
  }


  private createFormGroup(obj: any): FormGroup {
    const group: any = {};
    for (const key of Object.keys(obj)) {
      group[key] = obj[key] instanceof FormControl ? obj[key] : this.createFormGroup(obj[key]);
    }
    return this.fb.group(group);
  }

  private mapValidators(validations: string[]) {
    const validatorFns = [];
    for (const val of validations) {
      if (val === 'required') validatorFns.push(Validators.required);
      else if (val === 'email') validatorFns.push(Validators.email);
      else if (val === 'noSpaces') validatorFns.push(this.noSpacesValidator);
      else if (val === 'noCaps') validatorFns.push(this.noCapsValidator);
      else if (val === 'phoneNumber') validatorFns.push(this.phoneNumberValidator());
    }
    return validatorFns;
  }

  getFormControl(key: string): FormControl {
    const segments = key.split('.');
    let control: any = this.form;
    for (const segment of segments) {
      control = control.get(segment);
      if (!control) throw new Error(`FormControl with key '${key}' not found.`);
    }
    return control as FormControl;
  }

  filterAutocomplete(field: any) {
    const value = (this.getFormControl(field.key).value || '').toLowerCase();
    this.filteredOptions[field.key] = field.options.filter((option: string) =>
      option.toLowerCase().includes(value)
    );
  }

  onSubmit() {
    this.submit.emit(this.form.getRawValue());
  }

  cancelProcess() {
    this.cancel.emit(false);
  }

  resetForm() {
    this.form.reset();
  }

  forgotPasswordFunc() {
    this.userService.forgotUser(this.form.getRawValue()).subscribe(() => {
      this.toasterService.success("Password Updated Successfully");
    }, (error: any) => {
      this.toasterService.error(error.message);
    });
    this.resetForm();
  }

  onFilesDropped(files: NgxFileDropEntry[], fieldKey: string) {
    const fileList: File[] = [];

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (!this.uploadedFiles[fieldKey]) {
            this.uploadedFiles[fieldKey] = [];
          }

          this.uploadedFiles[fieldKey].push(file);
          this.getFormControl(fieldKey).setValue(this.uploadedFiles[fieldKey]);
        });
      }
    }
  }

  removeFile(fieldKey: string, index: number): void {
    if (this.uploadedFiles[fieldKey]) {
      this.uploadedFiles[fieldKey].splice(index, 1);
      const updatedList = [...this.uploadedFiles[fieldKey]];

      // Update form control
      this.getFormControl(fieldKey).setValue(updatedList);

      // Optional: if required validator is used
      this.getFormControl(fieldKey).updateValueAndValidity();
    }
  }

}
