import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GalleryItem, GalleryService } from '../../services/gallery.service';
import { GalleryItemsPage } from '../gallery-items/gallery-items';

@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html',
    providers: [GalleryService],
})
export class GalleryPage implements OnInit {
    items: GalleryItem[];

    constructor(
        private galleryService: GalleryService,
        private nav: NavController,
        params: NavParams,
    ) {}

    ngOnInit() {
        console.log('GalleryPage.ngOnInit()');
        this.galleryService
            .getGallery()
            .then(gallery => {
                console.log('gallery:', gallery);
                this.items = gallery;
            });
    }
}
