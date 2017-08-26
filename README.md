# FHIR Web App

The Front-End application is a Single-Page Web Application written in TypeScript (a superset of JavaScript) using the Ionic Framework. It is compatible with any device with a modern Web browser. Its UI is particulary suited for mobile devices.

## Application Overview
The application contains six pages : Patient List page, add New Patient page, Document List page, add New Document page, Settings page and About page. Each one has a specific role and is described below.

### Patient List Page
The patients page shows you the patients that you created. Patients don’t correspond to existing patients on the remote server, instead they can be viewed as ‘bookmarks’ for quickly accessing documents. Patients are stored on the browser’s local storage. You can edit or delete an existing patient by sliding it either to the left (for editing) or to the right (for deleting). You can add a new patient by clicking the blue button on the bottom right which redirects you to the *New Patient Page*.
Clicking on a patient brings to the *Document List Page*.
If only one patient is registered, this page will be bypassed and the patient’s documents will directly be shown.

### New Patient Page
This page allows you to add a patient to the. It has two inputs: the name (which can be anything) and the ID (which has to exist on the server). Once you filled those two fields, you press the button Create Patient and it redirects you to the Patients page, but this time with your new patient created.
This page is also used for editing an existing Patient.

### Document List Page
This page fetches all documents for the selected patient from the remote server and lists them. The documents are listed by order of creation for now. If you click on the the blue button on the bottom right which redirects you to the *New Document Page*. By clicking on the download icon, the document is downloaded to the device.

### New Document Page
This page allows you to add a new document for a patient. You have to fill in two fields first:
descritpion and date, and then choose the file you want to upload from your device. Once all this is done, you can click the upload button which will redirect you to the *Document List Page* you were before, but now with the new document uploaded.

### Settings Page
The settings page allows you to change the FHIR server URL in case you want to put a different
one. By defult it’s http://localhost:8080/fhir (FHIR base URL from [XdsOnFhir](https://github.com/ahdis/XDSonFHIR)). To go to the settings page, there is a settings icon on the top right of the *Patients* and *Document List* pages. Also, there is a small information icon on the top right of the page which will redirect you to the *About Page*.

### About Page
This is a simple page with ahdis credentials as well as with what the application was made.

## Architecture
Communication with a FHIR backend is performed through the *FhirProvider* class (`src/providers/fhir/fhir.ts`). Angular automatically injects an instance of this class in pages that declare it as dependency in their constructor. The principal methods are `uploadDocument()` and `getResource()`. The latter serves as a base for "GET" requests, it makes the API call to fetch a given resource and extracts the result to an array. For now, it is only used by `getDocumentReferences()` which calls `getResource("DocumentReference", "patient={patientId})`.

`uploadDocument()` performs the ITI-65 (Provide Document Bundle) transaction. It takes as parameter a Patient (subject of the document), a DocumentReference (document metadata) and a bas64-encoded file (as provided by the file input in *New Document Page*). With this data, a transaction Bundle is created and sent to the backend.

*FhirProvider* is also responsible for maintaining the list of Patient ‘bookmarks’ and saving/loading them to/from the browser's storage (through the `getPatients()` and `{add,update,delete}Patient()` methods).

This project depends on [@types/fhir](https://www.npmjs.com/package/@types/fhir), which provides type definitions for FHIR resources. This allows the TypeScript compiler to type-check objects (such as the Bundle constructed in `uploadDocument()`) and avoid some errors during development.

---

## How to run
First, install `nodejs` and `npm` (see [https://nodejs.org/en/download/package-manager/] for insructions), then install `ionic` through `npm`:
```bash
sudo npm install -g ionic
```

Then, install all node dependecies:
```bash
npm install
```

Finally, the app can be previewed by running a local server:
```bash
ionic serve
```

## Deploy with Docker
This app can also be deployed in a Docker container with the provided Dockerfile. Docker will build the app inside the container, and then run an nginx instance serving the app on port 80.

First, the image must be built:
```bash
docker build -t fhir-webapp .
```

Then, run a container by attaching port 80 to a port on your local machine, e.g.:
```
docker run --rm -p 8888:80 fhir-webapp
```
