import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { GalleryService } from '../../services/gallery.service';

@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html',
    providers: [GalleryService]
})
export class GalleryPage implements OnInit {
    thumbnails: string[] = [];

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
            .then(gallery => {
                console.log('gallery response:', gallery);
                this.thumbnails = gallery.thumbnails;
            });
    }
}
