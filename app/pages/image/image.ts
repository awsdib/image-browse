import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {GalleryPage, Post} from '../gallery/gallery';
import {LookupService, Options, Provider} from '../../backends/lookup-service';
import {saveNavState} from '../../save-restore';

const ACTIVE_SLIDES = 7;
const MIDDLE_INDEX = 3;

@Component({
    templateUrl: 'build/pages/image/image.html'
})
export class ImagePage {
    hostname: string;
    options: Options;
    provider: Provider;

    /// Array of all loaded posts in the gallery.
    posts: ImagePost[] = [];

    /// ID of the currently viewed post.
    postId: number;

    /// Subset of `posts` actively used by slides.
    ///
    /// The gallery may have hundreds or thousands of posts loaded at a time so only a few (less
    /// than a dozen) are active at a time to improve performance. Each time the user swipes to
    /// the next image the window of active posts shifts to follow the image the user is viewing.
    activePosts: ImagePost[];

    /// The currently selected index within `activePosts`.
    activeIndex: number;

    swiperOptions: any;
    swiper: any;

    constructor(
        private nav: NavController,
        private lookupService: LookupService,
        navParams: NavParams
    ) {
        this.hostname = navParams.get('hostname');
        this.options = navParams.get('options');

        this.provider = this.lookupService.getProvider(this.hostname, this.options);

        // Add extra data to posts to use in the image view.
        let basePosts = this.provider.allPosts();

        for (let post of basePosts) {
            this.posts.push(new ImagePost(post));
        }

        this.postId = navParams.get('id');

        this.updateActivePosts(this.postId);

        this.swiperOptions = {
            initialSlide: this.activeIndex,
            longSwipesRatio: 0.2,

            onInit: (swiper) => { this.swiper = swiper; },
        };
    }

    collectState() {
        return {
            hostname: this.hostname,
            options: this.options,
            id: this.postId,
        };
    }

    onSlideChange($event) {
        let newIndex = $event.activeIndex;
        let newPost = this.activePosts[newIndex];

        // Force Swiper to go to the newly active slide.
        this.updateActivePosts(newPost.id);
        this.swiper.activeIndex = this.activeIndex;
        this.swiper.update(true);

        saveNavState(this.nav, this.lookupService);
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

        this.nav.push(
            GalleryPage,
            {
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

    updateActivePosts(id: number) {
        let index = this.posts.map(post => post.id).indexOf(id);

        let startIndex = clamp(index - MIDDLE_INDEX, 0, this.posts.length);
        let endIndex = clamp(startIndex + ACTIVE_SLIDES, 0, this.posts.length);

        this.postId = id;
        this.activeIndex = index - startIndex;
        this.activePosts = this.posts.slice(startIndex, endIndex);

        let post = this.posts[index];
        post.load();
    }
}

/// Extends the base Post with extra functionality used for the image view.
class ImagePost implements Post {
    image: string;
    thumbnail: string;
    sample: string;
    tags: string[];
    id: number;
    display: string;
    loaded: boolean;

    constructor(base: Post) {
        this.image = base.image;
        this.thumbnail = base.thumbnail;
        this.sample = base.sample;
        this.tags = base.tags;
        this.id = base.id;
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
