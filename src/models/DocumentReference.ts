export class DocumentReference implements fhir.DocumentReference {
  status: fhir.code;
  type: fhir.CodeableConcept;
  indexed: fhir.instant;
  content: fhir.DocumentReferenceContent[];
  description: string;
  subject: fhir.Reference;

  constructor(data?) {
    data = data || {};
    Object.assign(this, data);
    console.log(data)
  }
}
