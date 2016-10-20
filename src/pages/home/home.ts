import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { GalleryPage } from '../gallery/gallery';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    constructor(private nav: NavController) {}

    goToGallery() {
        this.nav.push(GalleryPage);
    }
}
