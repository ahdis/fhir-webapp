import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';

import {DocumentReference} from "../../models/DocumentReference";
import {FhirProvider} from "../../providers/fhir/fhir";
import {NewDocumentPage} from "../new-document/new-document";
import {Patient} from "../../models/Patient";
import {SettingsPage} from "../settings/settings";

@Component({
  selector: 'page-document-list',
  templateUrl: 'document-list.html',
})
export class DocumentListPage {
  public patient: Patient;
  public documents: Array<any>;
  private error: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fhir: FhirProvider,
              public loadingCtrl: LoadingController) {
    this.patient = this.navParams.get('patient');
  }

  public ionViewDidEnter() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present().then();

    this.fhir.getDocumentReferences(this.patient)
      .finally(() => loading.dismissAll())
      .subscribe(
        documents => {
          this.error = null;
          this.documents = documents;
        },
        err => {
          console.log(err);
          this.error = err;
        });
  }

  public newDocument() {
    this.navCtrl.push(NewDocumentPage, {patient: this.patient}).then();
  }

  public download(doc: DocumentReference) {
    const url = doc.content[0].attachment.url;
    window.open(this.fhir.getAbsoluteUrl(url), '_system', 'location=yes')
  }

  public openSettings() {
    this.navCtrl.push(SettingsPage).then();
  }
}

