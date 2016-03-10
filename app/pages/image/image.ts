import {NavController, NavParams, Page} from 'ionic-angular';
import {Post} from '../gallery/gallery';

@Page({
  templateUrl: 'build/pages/image/image.html'
})
export class ImagePage {
  siteName: string;
  posts: Post[];
  index: number;
  swiperOptions: any;

  constructor(private nav: NavController, navParams: NavParams) {
    this.siteName = navParams.get('siteName');
    this.posts = navParams.get('posts');
    this.index = navParams.get('index');
    this.swiperOptions = {
      initialSlide: this.index,
    };
  }
}
