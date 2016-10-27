import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GalleryItem } from '../../services/gallery.service';
import { GalleryItemsPage } from '../../pages/gallery-items/gallery-items';

@Component({
    selector: 'gallery',
    templateUrl: 'gallery.html',
})
export class GalleryComponent {
    @Input()
    items: GalleryItem[];

    constructor(
        private nav: NavController,
        params: NavParams,
    ) {}

    onItemClick(item: GalleryItem) {
        this.nav.push(GalleryItemsPage, { selected: item });
    }
}
