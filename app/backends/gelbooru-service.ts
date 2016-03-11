import {Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Post} from '../pages/gallery/gallery';
import {SAFEBOORU_MOCK} from './mock-data/safebooru';
import {RULE34_MOCK} from './mock-data/rule34';
import * as URI from 'urijs';
import {Parser} from 'xml2js';

export interface Provider {
  getPosts(
    options: Options,
    successCallback: (posts: Post[]) => void,
    errorCallback: (message: string) => void
  );
}

export interface Options {
  offset?: number,
  tags?: string[],
}

@Injectable()
export class GelbooruService implements Provider {
  hostname: string;

  constructor(private platform: Platform, private http: Http) {}

  setHostname(hostname: string) {
    this.hostname = hostname;
  }

  getPosts(
    options: Options,
    successCallback: (posts: Post[]) => void,
    errorCallback: (message: string) => void
  ) {
    // TODO: Normalize hostname first.
    let siteConfig = SITE_CONFIGS[this.hostname];
    if (siteConfig === undefined) {
      return errorCallback('Site is not supported.');
    }

    // Always build the request url, even on desktop, so we can debug the result.
    let requestUrl = this.buildRequestUrl(options);

    if (this.platform.is('core')) {
      let response = siteConfig.sampleData;
      let posts = this.processResponse(response, successCallback, errorCallback);
    } else {
      // Make a web request to the server to get the posts list.

      this.http.get(requestUrl)
        .subscribe(
          response => {
            let posts = this.processResponse(response.text(), successCallback, errorCallback);
          },
          error => {
            errorCallback(error.toString());
          }
        );
    }
  }

  buildRequestUrl(options: Options): string {
    let requestUrl = URI({
      protocol: 'http',
      hostname: this.hostname,
      path: 'index.php',
      query: 'page=dapi&s=post&q=index',
    });

    // Apply each of the options to the search.
    if (options.offset) {
      requestUrl.addQuery({ 'pid': options.offset });
    }

    if (options.tags && options.tags.length > 0) {
      let tagsString = options.tags.join('+');
      requestUrl.addQuery({ 'tags': tagsString });
    }

    console.log(`request url: ${requestUrl}`);

    return requestUrl.toString();
  }

  processResponse(
    response: string,
    successCallback: (posts: Post[]) => void,
    errorCallback: (message: string) => void
  ) {
    // Parse the XML response.
    let parser = new Parser({
      mergeAttrs: true,
      explicitArray: false,
      explicitRoot: false,
      attrNameProcessors: [toCamelCase],
      tagNameProcessors: [toCamelCase],
    });
    parser.parseString(response, (error, parsedData) => {
      if (error != null) {
        // Xml parse error occurred.
        console.log('xml error:');
        console.log(error);
        return errorCallback(`Error parsing Xml response: ${error}`);
      }

      // Xml parsed successfully.
      let siteConfig = SITE_CONFIGS[this.hostname];

      let results = [];
      let counter = 0;
      for (let post of parsedData.post.slice(0, 100)) {
        // NOTE: Rule34 has weird behavior around the image and sample urls. The urls its provides
        // use the subdomain 'img.rule34.xxx' but the url for the image and sample actually
        // redirect to the image page on the website, leading to a broken image in
        // the app. If we strip the 'img' subdomain it works correctly so we do that here for the
        // image and sample urls. We need to leave the subdomain in place for the thumbnails or
        // they wind up broken most of the time. No other known sites have this problem but the
        // handling doesn't break them either so we leave it in place for simplicity.
        let image = new URI(post.fileUrl)
          .protocol('http')
          .subdomain('');
        let sample = new URI(post.sampleUrl)
          .protocol('http')
          .subdomain('');
        let thumbnail = new URI(post.previewUrl).protocol('http');

        results.push({
          image: image.toString(),
          sample: sample.toString(),
          thumbnail: thumbnail.toString(),
          tags: post.tags.split(' '),
          index: counter,
        });

        counter += 1;
      }

      successCallback(results);
    });
  }
}

const SITE_CONFIGS = {
  'safebooru.org': {
    sampleData: SAFEBOORU_MOCK,
  },
  'rule34.xxx': {
    sampleData: RULE34_MOCK,
  },
};

function toCamelCase(original: string): string {
  let result = original.replace(
      /([_\-]\w)/g,
      (matches) => { return matches[1].toUpperCase(); }
  );

  return result;
}
