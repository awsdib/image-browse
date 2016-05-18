import {NavController, NavParams, Page} from 'ionic-angular';
import {GalleryPage, Post} from '../gallery/gallery';

const ACTIVE_SLIDES = 7;
const MIDDLE_INDEX = 3;

@Page({
  templateUrl: 'build/pages/image/image.html'
})
export class ImagePage {
  hostname: string;
  posts: ImagePost[] = [];
  activePosts: ImagePost[];
  swiperOptions: any;
  swiper: any;
  options: any;
  index: number;

  constructor(private nav: NavController, navParams: NavParams) {
    this.hostname = navParams.get('hostname');
    this.options = navParams.get('options');

    // Add extra data to posts to use in the image view.
    let basePosts = navParams.get('posts');
    console.log("base posts:");
    console.log(basePosts);
    for (let post of basePosts) {
      this.posts.push(new ImagePost(post));
    }

    console.log("posts:");
    console.log(this.posts);

    this.index = navParams.get('index');
    console.log(`index: ${this.index}`);

    // Load image for first post.
    let post = this.posts[this.index];
    console.log("post:");
    console.log(post);
    post.load();

    let activeIndex = this.overrideIndex(this.index);

    this.swiperOptions = {
      initialSlide: activeIndex,
      longSwipesRatio: 0.2,

      onInit: (swiper) => { this.swiper = swiper; },
    };
  }

  collectState() {
    return {
      hostname: this.hostname,
      posts: this.posts,
      options: this.options,
    };
  }

  onSlideChange($event) {
    this.index = $event.activeIndex;
    let post = this.activePosts[this.index];
    let activeIndex = this.overrideIndex(post.index);

    // Force Swiper to go to the newly active slide.
    this.swiper.activeIndex = activeIndex;
    this.swiper.update(true);

    post.load();
  }

  onTagClick(tag: string) {
    let options = this.options.clone();
    options.tags = [tag];

    this.nav.push(GalleryPage, {
      hostname: this.hostname,
      options: options,
    });
  }

  onAddTagClick(tag: string) {
    let options = this.options.clone();
    if (!options.tags) {
      options.tags = [];
    }
    options.tags.push(tag);

    this.nav.push(GalleryPage, {
      hostname: this.hostname,
      options: options,
    });
  }

  onRemoveTagClick(tag: string) {
    let options = this.options.clone();
    if (!options.excludeTags) {
      options.excludeTags = [];
    }
    options.excludeTags.push(tag);

    this.nav.push(GalleryPage, {
      hostname: this.hostname,
      options: options,
    });
  }

  overrideIndex(index: number): number {
    let startIndex = clamp(index - MIDDLE_INDEX, 0, this.posts.length);
    let endIndex = clamp(startIndex + ACTIVE_SLIDES, 0, this.posts.length);
    let activeIndex = index - startIndex;

    this.activePosts = this.posts.slice(startIndex, endIndex);
    return activeIndex;
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
      this.display = this.sample;
      this.loaded = true;
    };
    image.src = this.sample;
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
