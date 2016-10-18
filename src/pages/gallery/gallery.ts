import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html'
})
export class GalleryPage {
    thumbnails: string[] = [];

    constructor(public nav: NavController, params: NavParams) {
        this.thumbnails = params.get('thumbnails');
    }
}
