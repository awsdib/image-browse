import {NavController, Page} from 'ionic-angular';
import * as gallery from '../gallery/gallery';


@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  siteInput: string = '';

  constructor(private nav: NavController) {}

  submit() {
    console.log(`site address: ${this.siteInput}`);

    // TODO: Validate url input before sending it to gallery page.

    this.nav.push(gallery.GalleryPage, {
      'siteName': this.siteInput,
    });
  }
}
