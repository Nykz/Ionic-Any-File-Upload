import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonText,
  IonButton,
  IonToast,
} from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonButton,
    IonText,
    IonIcon,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
  ],
})
export class HomePage {
  @ViewChild('filePicker', { static: false }) filePickerRef!: ElementRef;
  imageFile: any;
  image: any;
  isImageFile = false;

  isToast = false;
  toastData: any = {};

  private http = inject(HttpClient);

  constructor() {}

  onFileChosen(event: any) {
    this.isImageFile = true;
    console.log(event);
    const file = event.target.files[0];
    if (!file) return;
    console.log('file: ', file);
    this.imageFile = file;

    const mimeType = this.imageFile.type;
    console.log('mimetype: ', mimeType);
    if (mimeType.match(/image\/*/) == null) {
      console.log('not an image');
      this.isImageFile = false;
      // return null;
    }

    const reader = new FileReader();
    console.log(reader);
    reader.onload = () => {
      const dataUrl = reader.result!.toString();
      this.image = dataUrl;
      console.log('image: ', this.image);
    };
    reader.readAsDataURL(file);
  }

  changeFile() {
    this.filePickerRef.nativeElement.click();
  }

  async uploadFile() {
    try {
      if (!this.imageFile) {
        this.isToast = true;
        this.toastData = {
          color: 'danger',
          message: 'No file selected',
        };
        return;
      }

      let postData = new FormData();

      postData.append(
        'any_file',
        this.imageFile,
        Date.now() + '_' + this.imageFile.name
      );

      const result = await lastValueFrom(
        this.http.post('http://127.0.0.1:8000/api/upload_file', postData)
      );
      console.log(result);

      this.isToast = true;
      this.toastData = {
        message: 'File uploaded successfully',
        color: 'success',
      };
    } catch (e: any) {
      console.log(e);
      this.isToast = true;
      this.toastData = {
        color: 'danger',
        message: e?.error?.error?.any_file
          ? this.arrayJoin(e?.error?.error?.any_file)
          : (e?.error?.error ? e.error.error : ('File too large')),
      };
    }
  }

  arrayJoin(array: any) {
    return array.join(', ');
  }
}
