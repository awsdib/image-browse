import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { GalleryItem, GalleryService } from '../../services/gallery.service';

@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html',
    providers: [GalleryService]
})
export class GalleryPage implements OnInit {
    items: GalleryItem[];

    constructor(
        private galleryService: GalleryService,
        public nav: NavController,
        params: NavParams
    ) {
        console.log('nav params', params);
    }

    ngOnInit() {
        console.log('GalleryPage.ngOnInit()');
        this.galleryService
            .getGallery()
            .then(gallery => { this.items = gallery; });
    }
}
