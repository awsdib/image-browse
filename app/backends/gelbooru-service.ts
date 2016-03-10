import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Post} from '../pages/gallery/gallery';
import {SAFEBOORU_MOCK} from './mock-data/safebooru';
import * as URI from 'urijs';

export interface PostProvider {
  getPosts(
    siteAddress: string,
    offset: number,
    successCallback: (posts: Post[]) => void,
    errorCallback: (message: string) => void
  );
}

@Injectable()
export class GelbooruService implements PostProvider {
  constructor(private platform: Platform) {
    console.log(this.platform.platforms());
  }

  getPosts(
    siteAddress: string,
    offset: number,
    successCallback: (posts: Post[]) => void,
    errorCallback: (message: string) => void
  ) {
    let response;

    if (this.platform.is('core')) {
      response = SAMPLE_DATA[siteAddress];

      if (response === undefined) {
        return errorCallback(`No sample data exists for ${siteAddress}.`);
      }
    } else {
      // Make a web request to the server to get the posts list.
      return errorCallback('Web requests not yet implemented.');
    }

    let results = [];
    let counter = 0;
    for (let post of response) {
      let image = URI({
        protocol: 'http',
        hostname: siteAddress,
        path: `images/${post.directory}/${post.image}`,
      }).toString();

      let sample;
      if (post.sample) {
        sample = URI({
          protocol: 'http',
          hostname: siteAddress,
          path: `samples/${post.directory}/sample_${post.image}`,
        }).toString();
      } else {
        sample = image;
      }


      let thumbnail = URI({
        protocol: 'http',
        hostname: siteAddress,
        path: `thumbnails/${post.directory}/thumbnail_${post.image}`,
      }).toString();

      results.push({
        image: image,
        thumbnail: thumbnail,
        sample: sample,
        tags: post.tags.split(' '),
        index: counter,
      });

      counter += 1;
    }

    successCallback(results);
  }
}

var SAMPLE_DATA = {
  'safebooru.org': SAFEBOORU_MOCK,
}
