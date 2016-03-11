import {NavController, NavParams, Page} from 'ionic-angular';
import {Post} from '../gallery/gallery';

@Page({
  templateUrl: 'build/pages/image/image.html'
})
export class ImagePage {
  siteName: string;
  posts: any[];
  swiperOptions: any;

  constructor(private nav: NavController, navParams: NavParams) {
    this.siteName = navParams.get('siteName');
    this.posts = navParams.get('posts');
    let index = navParams.get('index');
    this.swiperOptions = {
      initialSlide: index,
    };

    // Add extra data to posts to use in the image view.
    for (let post of this.posts) {
      post.display = post.thumbnail;
      post.loaded = false;
      post.load = function () {
        let image = new Image();
        image.onload = () => {
          console.log(`Image loaded: ${this.sample}`);
          this.display = this.sample;
          this.loaded = true;
        };
        image.src = this.sample;
      };
    }

    // Load image for first post.
    let post = this.posts[index];
    post.load();
  }

  onSlideChange($event) {
    console.log('slide change:');
    console.log($event);

    // Initialize first post.
    let index = $event.activeIndex;
    let post = this.posts[index];
    if (post.loaded) {
      // Post has already been loaded, don't try to load it again.
      return;
    }

    post.load();
  }
}
