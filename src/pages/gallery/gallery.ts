import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GalleryItem } from '../../services/gallery.service';
import { GalleryItemsPage } from '../gallery-items/gallery-items';

@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html',
})
export class GalleryPage {
    id: string;

    constructor(
        private nav: NavController,
        params: NavParams,
    ) {
        this.id = params.get('id');
    }
}
