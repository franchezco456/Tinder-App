import { Injectable } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth/auth';
import { File } from 'src/app/core/providers/file/file';
import { Uploader } from 'src/app/core/providers/uploader/uploader';

@Injectable({
  providedIn: 'root'
})
export class Images {

  constructor(private readonly fileSrv: File, private readonly uploaderSrv: Uploader, private readonly authSrv: Auth){}
  public async uploadImage(email: string) {
    const image = await this.fileSrv.pickImage();
    const url = await this.uploaderSrv.uploadImage(
      'Tinder',
      'images/' + email,
      `${Date.now()}-${image.name}`,
      image.data || '',
      image.mimeType
    );
    console.log('TAG_IMAGE', JSON.stringify(image));
    console.log(url);
    return url;
  }

}
