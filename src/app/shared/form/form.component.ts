import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() formCreation: any[] = [];
  @Input() message: string = "";
  @Input() services: any = []
  @Input() cancelVisible : boolean = true;
  @Input() forgotPassword : boolean = false;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;

  constructor(private fb: FormBuilder, private userService:UserService, private toasterService:ToasterService) { }

  ngOnInit() {
    const flatObject: any = {};
    for (const field of this.formCreation) {
      this.setNestedValue(flatObject, field.key.split('.'), field.value, field.validation, field.disabled);
      this.setNestedValue(flatObject, field.key.split('.'), field.value, field.validation, field.disabled);
    }
    this.form = this.createFormGroup(flatObject);
  }

  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    return (control.value || '').includes(' ') ? { noSpaces: true } : null;
  }
  noCapsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    return hasUpperCase ? { noCaps: true } : null;
  }

  private setNestedValue(obj: any, path: string[], value: string, validations: string[], disabled?: boolean) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = current[path[i]] || {};
      current = current[path[i]];
    }

    const control = new FormControl({ value, disabled: !!disabled }, this.mapValidators(validations));
    current[path[path.length - 1]] = control;
  }

  private createFormGroup(obj: any): FormGroup {
    const group: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof FormControl) {
        group[key] = obj[key];
      } else {
        group[key] = this.createFormGroup(obj[key]);
      }
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
      else if (val === 'noSpaces') validatorFns.push(this.noSpacesValidator);
      else if (val === 'noCaps') validatorFns.push(this.noCapsValidator);
    }
    return validatorFns;
  }

  getFormControl(key: string): FormControl {
    const segments = key.split('.');
    let control: any = this.form;
    for (const segment of segments) {
      control = control.get(segment);
      if (!control) {
        throw new Error(`FormControl with key '${key}' not found.`);
      }
    }
    return control as FormControl;
  }

  setFormValues(data: any) {
    this.form.patchValue(data);
  }

  resetForm() {
    this.form.reset();
  }

  onSubmit() {
    this.submit.emit(this.form.value);
  }

  cancelProcess(arg0: boolean) {
    this.cancel.emit(false);
  }

  forgotPasswordFunc(){
    this.userService.forgotUser(this.form.value).subscribe(()=>{
      this.toasterService.success("PAssword Updated Successfully");
    },(error:any)=>{
      this.toasterService.error(error.message);
    })
    this.resetForm();
  }


}
