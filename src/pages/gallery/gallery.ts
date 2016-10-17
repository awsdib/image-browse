import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html'
})
export class GalleryPage {
    constructor(public nav: NavController, navParams: NavParams) {}
}
