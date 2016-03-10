import {NavController, NavParams, Page} from 'ionic-angular';
import {ImagePage} from '../image/image';
import {GelbooruService} from '../../backends/gelbooru-service';

@Page({
  templateUrl: 'build/pages/gallery/gallery.html'
})
export class GalleryPage {
  siteName: string;
  posts: Post[];
  rows: Post[][];

  constructor(private nav: NavController, navParams: NavParams) {
    this.siteName = navParams.get('siteName');
    this.posts = (new GelbooruService(this.siteName)).getPosts();

    const POSTS_PER_ROW = 3;
    this.rows = [];
    for (let start = 0; start < this.posts.length; start += POSTS_PER_ROW) {
      this.rows.push(this.posts.slice(start, start + POSTS_PER_ROW));
    }
  }

  buttonClick(post: Post) {
    this.nav.push(ImagePage, {
      posts: this.posts,
      index: 0,
    });
  }
}

export interface Post {
  image: string,
  thumbnail: string,
  sample: string,
  tags: Array<string>,
}
