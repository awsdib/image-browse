import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Post} from '../pages/gallery/gallery';
import {SAFEBOORU_MOCK} from './mock-data/safebooru';
import {RULE34_MOCK} from './mock-data/rule34';
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
  constructor(private platform: Platform, private http: Http) {}

  getPosts(
    siteAddress: string,
    offset: number,
    successCallback: (posts: Post[]) => void,
    errorCallback: (message: string) => void
  ) {
    // TODO: Normalize hostname first.
    let siteConfig = SITE_CONFIGS[siteAddress];
    if (siteConfig === undefined) {
      return errorCallback('Site is not supported.');
    }

    if (this.platform.is('core')) {
      let response = siteConfig.sampleData;
      let posts = processResponse(siteAddress, response);
      successCallback(posts);
    } else {
      // Make a web request to the server to get the posts list.
      let requestUrl = URI({
        protocol: 'http',
        hostname: siteAddress,
        path: 'index.php',
        query: 'page=dapi&s=post&q=index&json=1',
      }).toString();
      console.log(`request url: ${requestUrl}`);

      this.http.get(requestUrl)
        .subscribe(
          response => {
            console.log('response:');
            console.log(response);
            let posts = processResponse(siteAddress, response.json());
            successCallback(posts);
          },
          error => {
            errorCallback(error.toString());
          },
          () => {}
        );
    }
  }
}

function processResponse(hostname: string, response): Post[] {
  console.log('response before processing:');
  console.log(response);

  let siteConfig = SITE_CONFIGS[hostname];

  let results = [];
  let counter = 0;
  for (let post of response) {
    let image = new URI({
      protocol: 'http',
      hostname: hostname,
      path: `images/${post.directory}/${post.image}`,
    });

    let sample;
    if (post.sample) {
      sample = new URI({
        protocol: 'http',
        hostname: hostname,
        path: `samples/${post.directory}/sample_${post.image}`,
      });
    } else {
      sample = image.clone();
    }

    let thumbnail = new URI({
      protocol: 'http',
      hostname: siteConfig.thumbnailHostname,
      path: `thumbnails/${post.directory}/thumbnail_${post.image}`,
    });

    // Overrid the suffix if necessary.
    if (siteConfig.hasOwnProperty('thumbnailSuffixOverride')) {
      sample.suffix(siteConfig.thumbnailSuffixOverride);
      thumbnail.suffix(siteConfig.thumbnailSuffixOverride);
    }

    results.push({
      image: image.toString() + `?${post.id}`,
      sample: sample.toString() + `?${post.id}`,
      thumbnail: thumbnail.toString(),
      tags: post.tags.split(' '),
      index: counter,
    });

    counter += 1;
  }

  return results;
}

const SITE_CONFIGS = {
  'safebooru.org': {
    thumbnailHostname: 'safebooru.org',
    sampleData: SAFEBOORU_MOCK,
  },
  'rule34.xxx': {
    thumbnailHostname: 'img.rule34.xxx',
    thumbnailSuffixOverride: 'jpg',
    sampleData: RULE34_MOCK,
  },
};
