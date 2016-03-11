import {Alert, NavController, NavParams, Page} from 'ionic-angular';
import {ImagePage} from '../image/image';
import {GelbooruService, Options} from '../../backends/gelbooru-service';

@Page({
  templateUrl: 'build/pages/gallery/gallery.html',
  providers: [GelbooruService],
})
export class GalleryPage {
  hostname: string;
  options: Options;
  posts: Post[];
  rows: Post[][];

  constructor(
    private nav: NavController,
    private provider: GelbooruService,
    navParams: NavParams
  ) {
    this.hostname = navParams.get('hostname');
    this.options = <Options>navParams.get('options');
    this.provider.setHostname(this.hostname);
    this.provider.getPosts(
      0,
      (posts) => {
        this.posts = posts;

        // Break posts into rows so that they can be displayed in a grid.
        const POSTS_PER_ROW = 3;
        this.rows = [];
        for (let start = 0; start < this.posts.length; start += POSTS_PER_ROW) {
          this.rows.push(this.posts.slice(start, start + POSTS_PER_ROW));
        }
      },
      (message: string) => {
        let alert = Alert.create({
          title: 'Error Loading Posts',
          subTitle: message,
          buttons: ['Ok'],
        });
        this.nav.pop();
        this.nav.present(alert);
      }
    );
  }

  buttonClick(post: Post) {
    this.nav.push(ImagePage, {
      posts: this.posts,
      index: post.index,
    });
  }
}

export interface Post {
  image: string,
  thumbnail: string,
  sample: string,
  tags: Array<string>,
  index: number,
}
