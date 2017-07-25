import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Patient} from "../../models/Patient";
import {FhirProvider} from "../../providers/fhir/fhir";


@Component({
  selector: 'page-new-document',
  templateUrl: 'new-document.html',
})
export class NewDocumentPage {
  public patient: Patient;
  public file?: any;
  private form: FormGroup;
  private error: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fhir: FhirProvider,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController) {

    this.patient = navParams.get('patient');
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      indexed: [new Date().toISOString(), Validators.required]
    });
  }

  public save() {
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      this.upload(e.target.result);
    };

    reader.readAsDataURL(this.file)
  }

  public onFile(event: any) {
    this.file = event.target.files[0];
  }

  private upload(data: string) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present().then();

    this.fhir.uploadDocument(this.patient, this.form.value, data)
      .finally(() => loading.dismissAll())
      .subscribe(
        () => {
          this.error = null;
          this.navCtrl.pop().then()
        },
        err => {
          console.log(err);
          this.error = err;
        });
  }
}
