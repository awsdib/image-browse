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
            .toPromise()
            .then(
                (response) => {
                    let responseJson = response.json();
                    console.log('response: ', responseJson);

                    let promises: Promise<GalleryItem>[] = responseJson.data.map(item => {
                        if (!item.is_album) {
                            return Promise.resolve({
                                isGallery: false,
                                thumbnail: 'http://i.imgur.com/' + item.id + 'b.gif',
                                url: item.link,
                            });
                        }

                        // Create another request to get the information for the album.
                        let url = `https://api.imgur.com/3/album/${item.id}`;

                        return this.http
                            .get(url, {
                                headers: new Headers({ 'Authorization': 'Client-ID 3c11f0f3bfe340d' })
                            })
                            .toPromise()
                            .then(
                                (response) => {
                                    let responseJson = response.json();
                                    console.log("Album json: ", responseJson);

                                    let items = responseJson.data.images.map(image => {
                                        return {
                                            isGallery: false,
                                            thumbnail: 'http://i.imgur.com/' + image.id + 'b.gif',
                                            url: image.link,
                                        };
                                    });

                                    return {
                                        isGallery: true,
                                        thumbnail: 'http://i.imgur.com/' + item.cover + 'b.gif',
                                        items: items,
                                    };
                                }
                            );
                    });

                    return Promise.all(promises);
                },
                (error) => {
                    console.log("Error occurred: ", error);
                },
            );
    }
}

// TODO: Figure out how to represent the difference between gallery images and gallery albums better.
export class GalleryItem {
    isGallery: boolean;
    thumbnail: string;

    // Only if is a single image.
    url: string;

    // Only if is a gallery.
    items: GalleryItem[];
}

export class Image {
    url: string;
}
