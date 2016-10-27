import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GalleryItem, GalleryService } from '../../services/gallery.service';
import { GalleryItemsPage } from '../../pages/gallery-items/gallery-items';

@Component({
    selector: 'gallery',
    templateUrl: 'gallery.html',
    providers: [GalleryService],
})
export class GalleryComponent {
    @Input()
    id: string;

    items: GalleryItem[] = [];

    constructor(
        private galleryService: GalleryService,
        private nav: NavController,
        params: NavParams,
    ) {}

    ngOnInit() {
        this.galleryService
            .getGalleryItems(this.id)
            .then(gallery => {
                console.log('gallery:', gallery);
                this.items = gallery;
            });
    }

    onItemClick(item: GalleryItem) {
        console.log('going to gallery items page for: ', this.id);
        this.nav.push(GalleryItemsPage, { id: this.id, selected: item });
    }
}
