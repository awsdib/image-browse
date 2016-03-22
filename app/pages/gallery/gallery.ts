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
  more: boolean = true;

  constructor(
    private nav: NavController,
    private provider: GelbooruService,
    navParams: NavParams
  ) {
    this.hostname = navParams.get('hostname');
    this.options = navParams.get('options');
  }

  onPageLoaded() {
    this.provider.setHostname(this.hostname);
    this.provider.setOptions(this.options);
    this.provider.getPosts(
      (posts, more) => {
        this.posts = posts;
        this.rebuildGrid();
        this.more = more;
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

  onImageClick(post: Post) {
    this.nav.push(ImagePage, {
      hostname: this.hostname,
      posts: this.posts,
      index: post.index,
      options: this.options.clone(),
    });
  }

  onInfinite($event: any) {
    this.provider.getPosts(
      (posts, more) => {
        Array.prototype.push.apply(this.posts, posts);
        console.log(`total posts: ${this.posts.length}`);
        this.rebuildGrid();
        $event.complete();
        $event.enable(more);
      },
      error => {
        console.log(`Error getting more posts: ${error}`);
        $event.complete();
      }
    );
  }

  rebuildGrid() {
    // Break posts into rows so that they can be displayed in a grid.
    const POSTS_PER_ROW = 3;
    this.rows = [];
    for (let start = 0; start < this.posts.length; start += POSTS_PER_ROW) {
      this.rows.push(this.posts.slice(start, start + POSTS_PER_ROW));
    }
  }
}

export interface Post {
  image: string,
  thumbnail: string,
  sample: string,
  tags: Array<string>,
  index: number,
}
