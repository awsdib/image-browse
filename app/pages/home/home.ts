import {NavController, Page} from 'ionic-angular';
import * as gallery from '../gallery/gallery';
import * as URI from 'urijs';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  siteInput: string = 'safebooru.org';

  constructor(private nav: NavController) {}

  submit() {
    // TODO: Validate url input before sending it to gallery page.
    this.nav.push(gallery.GalleryPage, {
      'hostname': this.siteInput,
      'options': {},
    });
  }
}
