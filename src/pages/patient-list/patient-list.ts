import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Patient} from "../../models/Patient";
import {NewPatientPage} from "../new-patient/new-patient";
import {SettingsPage} from "../settings/settings";
import {FhirProvider} from "../../providers/fhir/fhir";
import {DocumentListPage} from "../document-list/document-list";

@Component({
  selector: 'page-patient-list',
  templateUrl: 'patient-list.html',
})
export class PatientListPage {

  public patients: Array<Patient> = [];
  private firstLoad: boolean = true;

  constructor(public navCtrl: NavController, public fhir: FhirProvider) {
  }

  public ionViewDidEnter() {
    this.fhir.getPatients()
      .subscribe(patients => {
        this.patients = patients;

        if (this.firstLoad && this.patients.length == 1) {
          const patient = this.patients[0];
          this.navCtrl.push(DocumentListPage, {patient}).then();
        }

        this.firstLoad = false;
      });
  }

  public openSettings() {
    this.navCtrl.push(SettingsPage).then();
  }

  public showDocuments(patient) {
    this.navCtrl.push(DocumentListPage, {patient}).then();
  }

  public editPatient(patient) {
    this.navCtrl.push(NewPatientPage, {patient}).then();
  }

  public deletePatient(patient) {
    this.fhir.deletePatient(patient)
      .subscribe(() => this.patients = this.fhir.patients);
  }

  public newPatient() {
    this.navCtrl.push(NewPatientPage).then();
  }
}
