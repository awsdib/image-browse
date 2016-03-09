import {NavController, NavParams, Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/gallery/gallery.html'
})
export class GalleryPage {
  siteName: string;

  constructor(private nav: NavController, navParams: NavParams) {
    this.siteName = navParams.get('siteName');
  }
}
