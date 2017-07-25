import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {MomentModule} from "angular2-moment";
import {AboutPage} from "../pages/about/about";
import {DocumentListPage} from "../pages/document-list/document-list";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {FhirProvider} from '../providers/fhir/fhir';
import {SettingsPage} from "../pages/settings/settings";
import {PatientListPage} from "../pages/patient-list/patient-list";
import {NewPatientPage} from "../pages/new-patient/new-patient";
import {NewDocumentPage} from "../pages/new-document/new-document";


@NgModule({
  declarations: [
    MyApp,
    PatientListPage,
    NewPatientPage,
    DocumentListPage,
    NewDocumentPage,
    SettingsPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule,
    FormsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PatientListPage,
    NewPatientPage,
    DocumentListPage,
    NewDocumentPage,
    SettingsPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FhirProvider,
  ]
})
export class AppModule {
}
