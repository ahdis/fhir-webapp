import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from "@ionic/storage"
import {Observable} from "rxjs/Rx";
import {Patient} from "../../models/Patient";
import * as uuid from 'uuid/v4';

@Injectable()
export class FhirProvider {
  public static DEFAULT_URL: string = 'http://localhost:8080/fhir';
  // => data:{contentType},base64;{data}
  private static DATA_REGEX: RegExp = /^data:(.+);base64,(.+)/;
  public url: string;
  public patients: Array<Patient>;

  constructor(public http: Http, public storage: Storage) {
    this.loadUrl().subscribe();
  }

  public getUrl(): Observable<string> {
    if (this.url)
      return Observable.of(this.url);
    else
      return this.loadUrl();
  }

  public setUrl(url: string): Observable<any> {
    this.url = url;
    return Observable.fromPromise(this.storage.set('url', url));
  }

  public getPatients(): Observable<Array<Patient>> {
    if (this.patients)
      return Observable.of(this.patients);
    else
      return this.loadPatients();
  }

  public addPatient(patient: Patient): Observable<any> {
    this.patients.push(patient);
    return this.savePatients();
  }

  public updatePatient(patient: Patient, oldId: string): Observable<any> {
    for (const p of this.patients) {
      if (p.id === oldId) {
        Object.assign(p, patient);
        return this.savePatients();
      }
    }

    return Observable.of(false);
  }

  public deletePatient(patient: Patient): Observable<any> {
    for (let i = 0; i < this.patients.length; i++) {
      const p = this.patients[i];
      if (p.id === patient.id) {
        this.patients.splice(i, 1);
        return this.savePatients();
      }
    }

    return Observable.of(false);
  }

  // data (uploaded files) is in the form: data:application/pdf,base64;XXXXXX

  public getDocumentReferences(patient: Patient) {
    const params = `patient=${encodeURIComponent(patient.id)}`;
    return this.getResource('DocumentReference', params);
  }

  public uploadDocument(patient: Patient, document: fhir.DocumentReference, rawData: string): Observable<any> {

    const match = FhirProvider.DATA_REGEX.exec(rawData);
    const contentType = match[1];
    const data = match[2];

    const docId = `urn:uuid:${uuid()}`;

    const bundle: fhir.Bundle = {
      resourceType: 'Bundle',
      type: 'transaction',
      meta: [{
        profile: 'http://ihe.net/fhir/tag/iti-65'
      }],
      entry: [
        // DocumentManifest
        {
          fullUrl: `urn:uuid:${uuid()}`,
          resource: {
            resourceType: 'DocumentManifest',
            status: 'current',
            content: [{
              pReference: {
                reference: docId,
              }
            }]
          },
          request: {
            method: 'POST',
            url: 'DocumentManifest'
          }
        },

        // DocumentReference
        {
          fullUrl: docId,
          resource: {
            resourceType: 'DocumentReference',
            ...document,
            subject: {
              reference: `Patient/${(patient.id)}`
            },
            // Binary Document
            content: [{
              attachment: {
                contentType,
                language: 'en-US', // TODO: don't hard-code language
                data
              }
            }]
          },
          request: {
            method: 'POST',
            url: 'DocumentReference'
          }
        }
      ]
    };

    console.log(bundle);

    const headers = new Headers({'Content-Type': 'application/fhir+json'});
    return this.http.post(this.url, bundle, headers);
  }

  public getAbsoluteUrl(url: string): string {
    return `${this.url}/${url}`;
  }

  private loadUrl(): Observable<string> {
    return Observable.fromPromise(
      this.storage.get('url')
        .then(url => this.url = url || FhirProvider.DEFAULT_URL));
  }

  // Save list of patients to internal storage
  private savePatients(): Observable<any> {
    return Observable.from(this.storage.set('patients', this.patients));
  }

  private loadPatients(): Observable<Array<Patient>> {
    return Observable.fromPromise(
      this.storage.get('patients')
        .then(patients => this.patients = patients || []));
  }

  private getResource(resource: string, params: string) {
    console.log('FhirProvider: get ' + this.getAbsoluteUrl(`${resource}?${params}`));
    return this.http
      .get(this.getAbsoluteUrl(`${resource}?${params}`))
      .map(result => result.json())
      .map(json => json.entry || [])
      .map(entry => entry.map(entry => (entry.resource)));
  }
}
