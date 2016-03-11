import {NavController, NavParams, Page} from 'ionic-angular';
import {GalleryPage, Post} from '../gallery/gallery';

@Page({
  templateUrl: 'build/pages/image/image.html'
})
export class ImagePage {
  hostname: string;
  posts: ImagePost[];
  swiperOptions: any;

  constructor(private nav: NavController, navParams: NavParams) {
    this.hostname = navParams.get('hostname');

    let basePosts = navParams.get('posts');
    let index = navParams.get('index');
    this.swiperOptions = {
      initialSlide: index,
      longSwipesRatio: 0.2,
    };

    // Add extra data to posts to use in the image view.
    this.posts = [];
    for (let post of basePosts) {
      this.posts.push(new ImagePost(post));
    }

    // Load image for first post.
    let post = this.posts[index];
    post.load();
  }

  onSlideChange($event) {
    let index = $event.activeIndex;
    let post = this.posts[index];

    post.load();
  }

  onTagClick(tag: string) {
    this.nav.push(GalleryPage, {
      hostname: this.hostname,
      options: {
        tags: [tag],
      },
    });
  }
}

/// Extends the base Post with extra functionality used for the image view.
class ImagePost implements Post {
  image: string;
  thumbnail: string;
  sample: string;
  tags: string[];
  index: number;
  display: string;
  loaded: boolean;

  constructor(base: Post) {
    this.image = base.image;
    this.thumbnail = base.thumbnail;
    this.sample = base.sample;
    this.tags = base.tags;
    this.index = base.index;
    this.display = this.thumbnail;
    this.loaded = false;
  }

  /// Loads the full resolution image for the post.
  ///
  /// Posts start with their display image set the thumbail so that the browser doesn't try to load
  /// dozens of high resolution images at once. Once an image is selected to be viewed it starts
  /// loading the full image in the background and once that image is cached by the browser it sets
  /// it to be the display image.
  load() {
    if (this.loaded) {
      // Post has already been loaded, don't try to load it again.
      return;
    }

    let image = new Image();
    image.onload = () => {
      console.log(`Image loaded: ${this.sample}`);
      this.display = this.sample;
      this.loaded = true;
    };
    image.src = this.sample;
  };
}
