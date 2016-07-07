import {Component} from '@angular/core';
import {Alert, Modal, NavController, NavParams} from 'ionic-angular';
import {ImagePage} from '../image/image';
import {LookupService, Options, Provider} from '../../backends/lookup-service';
import {SearchModal} from '../search-modal/search-modal';
import {saveNavState} from '../../save-restore';

export interface Post {
    image: string,
    thumbnail: string,
    sample: string,
    tags: Array<string>,
    id: number,
}

@Component({
  templateUrl: 'build/pages/gallery/gallery.html',
})
export class GalleryPage {
    hostname: string;
    options: Options;
    posts: Post[] = [];
    rows: Post[][];
    more: boolean = true;
    provider: Provider;

    constructor(
        private nav: NavController,
        private lookupService: LookupService,
        navParams: NavParams
    ) {
        this.hostname = navParams.get('hostname');
        this.options = navParams.get('options');

        this.provider = this.lookupService.getProvider(this.hostname, this.options);

        if (navParams.get('restore')) {
            this.posts = this.provider.allPosts();
            this.rebuildGrid();
        } else {
            // TODO: Initialize new page.
        }
    }

    collectState() {
        return {
            hostname: this.hostname,
            options: this.options,
        };
    }

    ionViewLoaded() {
        this.provider.getPosts(
            this.posts.length,
            (posts: Post[], more: boolean) => {
                Array.prototype.push.apply(this.posts, posts);
                this.rebuildGrid();
                this.more = more;

                saveNavState(this.nav, this.lookupService);
            },
            (message: string) => {
                let alert = Alert.create({
                    title: 'Error Loading Posts',
                    subTitle: message,
                    buttons: ['Ok'],
                });
                this.nav.pop();
                this.nav.present(alert);
            });
    }

    onImageClick(post: Post) {
        this.nav.push(
            ImagePage,
            {
                hostname: this.hostname,
                posts: this.posts,
                id: post.id,
                options: this.options.clone(),
            });
    }

    onHomeClick() {
        this.nav.popToRoot();
    }

    onSearchClick() {
        let modal = Modal.create(
            SearchModal,
            {
                hostname: this.hostname,
                options: this.options.clone(),
            });
        this.nav.present(modal);
    }

    onInfinite($event: any) {
        this.provider.getPosts(
            this.posts.length,
            (posts, more) => {
                Array.prototype.push.apply(this.posts, posts);
                this.rebuildGrid();
                $event.complete();
                $event.enable(more);

                saveNavState(this.nav, this.lookupService);
            },
            error => {
                console.log('Error getting more posts:', error);
                $event.complete();
            }
        );
    }

    rebuildGrid() {
        // HACK: We need the style to be "background-image: url(...);" and that doesn't seem to work with Angular's style
        // bindings, so we have to build the string from code and just set it in the template.
        for (let post of this.posts) {
            (<any>post).style = {
                'background-image': `url(${post.thumbnail})`,
            };
        }

        // Break posts into rows so that they can be displayed in a grid.
        const POSTS_PER_ROW = 3;
        this.rows = [];
        for (let start = 0; start < this.posts.length; start += POSTS_PER_ROW) {
            this.rows.push(this.posts.slice(start, start + POSTS_PER_ROW));
        }
    }
}
