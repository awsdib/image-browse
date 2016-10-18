import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { NavController } from 'ionic-angular';

import { GalleryPage } from '../gallery/gallery';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    constructor(private http: Http, private nav: NavController) {}

    goToGallery() {
        let url = 'https://api.imgur.com/3/gallery/hot/viral/0.json';

        this.http.get(url)
            .subscribe(
                response => {
                    let responseJson = response.json();
                    console.log('response: ', responseJson);

                    let images = responseJson.data.filter(item => !item.is_album);

                    console.log('images only: ', images);

                    let thumbnails = images.map(item => 'http://i.imgur.com/' + item.id + 'b.gif');

                    console.log('thumbnail urls: ', thumbnails);

                    this.nav.push(GalleryPage, { thumbnails: thumbnails });
                },
                error => { console.log("error response:", error); });
    }
}
