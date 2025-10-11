import { Component} from '@angular/core';
import { Uploader } from 'src/app/core/providers/uploader/uploader';
import { Query } from 'src/app/core/services/query/query';
import { Auth } from 'src/app/core/providers/auth/auth';
import { Images } from 'src/app/shared/services/images/images';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  public users: any[] = [];
  public liked: any[] = [];
  public rejected: any[] = [];
  constructor(private readonly querySrv: Query, private readonly uploadSrv: Uploader, private readonly authSrv: Auth, private readonly imagesSrv: Images) {
    this.loadUsers();
  }

  private async loadUsers(){
    const users = await this.querySrv.getAll('users');
    const uid = await this.authSrv.getUid();
    const visible = uid ? users.filter((u: any) => u.uid !== uid) : users;
    const withPhotos = await Promise.all(visible.map(async (u: any) => {
      try {
        const photos = u.email ? await this.imagesSrv.loadImagesFromUser(u.email) : (u.photos || []);
        return {
          ...u,
          photos: photos || (u.photos || []),
          passionsString: (u.passions || []).map((p: any) => p.category).join(', ')
        };
      } catch (err) {
        return {
          ...u,
          photos: u.photos || [],
          passionsString: (u.passions || []).map((p: any) => p.category).join(', ')
        };
      }
    }));

    this.users = withPhotos;
  }

  public formatPassions(passions: any[] | undefined): string {
    if (!passions || passions.length === 0) return '';
    return passions.map(p => p.category).join(', ');
  }

  public get currentUser(): any | null {
    return this.users && this.users.length ? this.users[0] : null;
  }

  public accept(): void {
    const user = this.currentUser;
    if (!user) return;
    this.liked.push(user);
    this.users.shift();
  }

  public reject(): void {
    const user = this.currentUser;
    if (!user) return;
    this.rejected.push(user);
    this.users.shift();
  }

}
