import {Alert, Modal, NavController, NavParams, Page} from 'ionic-angular';
import {ImagePage} from '../image/image';
import {GelbooruService, Options} from '../../backends/gelbooru-service';
import {SearchModal} from '../search-modal/search-modal';

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

  collectState() {
    return {
      hostname: this.hostname,
      options: this.options,
      posts: this.posts,
      more: this.more, // TODO: Do we want to save this or should we have to check again on startup?
    };
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

  onPageWillEnter() {
    console.log("Current nav stack:");
    for (let index = 0; index < this.nav.length(); index += 1) {
      let view = this.nav.getByIndex(index);
      console.log({
        page: view.instance.constructor,
        options: view.instance.collectState(),
      });
    }
  }

  onImageClick(post: Post) {
    this.nav.push(ImagePage, {
      hostname: this.hostname,
      posts: this.posts,
      index: post.index,
      options: this.options.clone(),
    });
  }

  onSearchClick() {
    let modal = Modal.create(SearchModal, {
      hostname: this.hostname,
      options: this.options.clone(),
    });
    this.nav.present(modal);
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
