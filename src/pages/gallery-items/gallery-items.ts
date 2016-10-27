import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GalleryItem, GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'page-gallery-items',
  templateUrl: 'gallery-items.html',
  providers: [GalleryService],
})
export class GalleryItemsPage implements OnInit {
    id: string;
    selected: GalleryItem;

    items: GalleryItem[] = [];

    constructor(
        private galleryService: GalleryService,
        private navCtrl: NavController,
        params: NavParams,
    ) {
        this.id = params.get('id');
        this.selected = params.get('selected');
    }

    ngOnInit() {
        console.log('GalleryPage.ngOnInit()');
        this.galleryService
            .getGalleryItems(this.id)
            .then(gallery => { this.items = gallery; });
    }
}
