import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GalleryItem, GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'page-gallery-items',
  templateUrl: 'gallery-items.html',
  providers: [GalleryService],
})
export class GalleryItemsPage implements OnInit {
    items: GalleryItem[] = [];

    constructor(private galleryService: GalleryService, private navCtrl: NavController, params: NavParams,) {}

    ngOnInit() {
        console.log('GalleryPage.ngOnInit()');
        this.galleryService
            .getGallery()
            .then(gallery => { this.items = gallery; });
    }

    ionViewDidLoad() {
        console.log('Hello GalleryItemsPage Page');
    }
}
