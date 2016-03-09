import {NavController, NavParams, Page} from 'ionic-angular';
import {GelbooruService, Post} from '../../backends/gelbooru-service';

@Page({
  templateUrl: 'build/pages/gallery/gallery.html'
})
export class GalleryPage {
  siteName: string;
  posts: Array<Post>;

  constructor(private nav: NavController, navParams: NavParams) {
    this.siteName = navParams.get('siteName');
    this.posts = (new GelbooruService(this.siteName)).getPosts();
    console.log(this.posts);
  }
}
