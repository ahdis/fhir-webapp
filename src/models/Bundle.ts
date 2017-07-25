import BundleEntry = fhir.BundleEntry;
import {DocumentReference} from "./DocumentReference";

export class Bundle implements fhir.Bundle {
  type: fhir.code = "transaction";
  entry: BundleEntry[] = [];

  constructor(doc: DocumentReference) {
    const manifest: fhir.DocumentManifest = new DocumentManifest();
    manifest.content = [doc];
    this.entry = [manifest];
  }
}

class DocumentManifest implements fhir.DocumentManifest {
  status: fhir.code = 'current';
  content: fhir.DocumentManifestContent[];
}
