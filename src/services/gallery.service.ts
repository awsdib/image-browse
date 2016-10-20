import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GalleryService {
    constructor(private http: Http) {}

    getGallery(): Promise<Gallery> {
        let url = 'https://api.imgur.com/3/gallery/hot/viral/0.json';
        return this.http.get(url)
            .map(response => {
                let responseJson = response.json();
                console.log('response: ', responseJson);

                let images = responseJson.data.filter(item => !item.is_album);

                console.log('images only: ', images);

                let thumbnails = images.map(item => 'http://i.imgur.com/' + item.id + 'b.gif');

                console.log('thumbnail urls: ', thumbnails);

                return { thumbnails: thumbnails };
            })
            .toPromise()
            .catch(error => { console.log("error response:", error); });
    }
}

export class Gallery {
    thumbnails: string[];
}
