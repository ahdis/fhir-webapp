import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FhirProvider} from "../../providers/fhir/fhir";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-new-patient',
  templateUrl: 'new-patient.html',
})
export class NewPatientPage {
  // true = we are creating a new Patient, false = editing an existing one
  public isNew: boolean;
  public oldId?: string;
  private form: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fhir: FhirProvider,
              public formBuilder: FormBuilder) {
    const patient = navParams.get('patient') || {};
    this.isNew = !patient.id;
    this.oldId = patient.id;

    this.form = this.formBuilder.group({
      name: [patient.name, Validators.required],
      id: [patient.id, Validators.required],
    });
  }

  public save() {
    (this.isNew ?
      this.fhir.addPatient(this.form.value) :
      this.fhir.updatePatient(this.form.value, this.oldId))
      .subscribe(() => this.navCtrl.pop().then());
  }
}
