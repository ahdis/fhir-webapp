import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AboutPage} from "../about/about";
import {FhirProvider} from "../../providers/fhir/fhir";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  private form: FormGroup;

  constructor(public navCtrl: NavController,
              public fhir: FhirProvider,
              public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      url: ['', Validators.required],
    });
  }

  public ionViewDidEnter() {
    this.fhir.getUrl()
      .subscribe(url => this.form.setValue({url}));
  }

  public openAbout() {
    this.navCtrl.push(AboutPage).then();
  }

  public save() {
    this.fhir.setUrl(this.form.value.url)
      .subscribe(() => this.navCtrl.pop().then());
  }
}
