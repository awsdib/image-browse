import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GalleryService {
    constructor(private http: Http) {}

    getGallery(): Promise<GalleryItem[]> {
        let url = 'https://api.imgur.com/3/gallery/hot/viral/0.json';
        console.log('using client id: 3c11f0f3bfe340d');
        return this.http
            .get(url, {
                headers: new Headers({ 'Authorization': 'Client-ID 3c11f0f3bfe340d' })
            })
            .map(response => {
                let responseJson = response.json();
                console.log('response: ', responseJson);

                let gallery = responseJson.data.map(item => {
                    let thumbnail;
                    if (item.is_album) {
                        thumbnail = 'http://i.imgur.com/' + item.cover + 'b.gif';
                    } else {
                        thumbnail = 'http://i.imgur.com/' + item.id + 'b.gif'
                    }

                    return {
                        isAlbum: item.is_album,
                        thumbnail: thumbnail
                    };
                });

                console.log('gallery items: ', gallery);

                return gallery;
            })
            .toPromise()
            .catch(error => { console.log("error response:", error); });
    }
}

export class GalleryItem {
    isAlbum: boolean;
    thumbnail: string;
}
