import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GalleryService {
    constructor(private http: Http) {}

    getGalleryItems(galleryId?: string): Promise<GalleryItem[]> {
        // For imgur, if we have an ID for the gallery then we know it's really an album. Galleries
        // are always top-level and so don't have IDs.
        if (galleryId) {
            return this.getAlbumItems(galleryId);
        }

        let url = 'https://api.imgur.com/3/gallery/hot/viral/0.json';

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
                                id: item.id,

                                url: item.link,
                            });
                        } else {
                            return this.getAlbumItems(item.id)
                                .then(items => {
                                return {
                                    isGallery: true,
                                    thumbnail: 'http://i.imgur.com/' + item.cover + 'b.gif',
                                    id: item.id,

                                    items: items,
                                };
                            });
                        }
                    });

                    return Promise.all(promises);
                },
                (error) => {
                    console.log("Error occurred: ", error);
                },
            );
    }

    private getAlbumItems(albumId: string): Promise<GalleryItem[]> {
        let url = `https://api.imgur.com/3/album/${albumId}`;
        return this.http
            .get(url, {
                headers: new Headers({ 'Authorization': 'Client-ID 3c11f0f3bfe340d' })
            })
            .toPromise()
            .then((response) => {
                let responseJson = response.json();
                return responseJson.data.images.map(image => {
                    return {
                        isGallery: false,
                        thumbnail: 'http://i.imgur.com/' + image.id + 'b.gif',
                        id: image.id,

                        url: image.link,
                    };
                });
            });
    }
}

// TODO: Figure out how to represent the difference between gallery images and gallery albums better.
export class GalleryItem {
    isGallery: boolean;
    thumbnail: string;
    id: string;

    // Only if is a single image.
    url: string;

    // Only if is a gallery.
    items: GalleryItem[];
}
