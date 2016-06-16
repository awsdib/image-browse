import {Platform} from 'ionic-angular';
import {Http} from '@angular/http';
import {Post} from '../pages/gallery/gallery';
import {SAFEBOORU_MOCK} from './mock-data/safebooru';
import {RULE34_MOCK} from './mock-data/rule34';
import * as URI from 'urijs';
import {Parser} from 'xml2js';
import {Options, Provider} from './lookup-service';

const POSTS_PER_PAGE: number = 100;

export class GelbooruProvider implements Provider {
    hostname: string;
    options: Options;
    posts: Post[] = [];

    constructor(
        hostname: string,
        options: Options,
        private platform: Platform,
        private http: Http
    ) {
        this.hostname = hostname;
        this.options = options;
    }

  getPosts(
    offset: number,
    successCallback: (posts: Post[], more: boolean) => void,
    errorCallback: (message: string) => void
  ) {
    // TODO: Normalize hostname first.
    let siteConfig = SITE_CONFIGS[this.hostname];
    if (siteConfig === undefined) {
      return errorCallback('Site is not supported.');
    }

    // Always build the request url, even on desktop, so we can debug the result.
    let requestUrl = this.buildRequestUrl(offset);

    if (this.platform.is('core')) {
      // For desktop testing use sample data. Use setTimeout() to simulate network delay (and not
      // block the main thread).
      window.setTimeout(() => {
        let response = siteConfig.sampleData;
        this.processResponse(
          response,
          successCallback,
          errorCallback,
          offset);
      }, 500);
    } else {
      // Make a web request to the server to get the posts list.
      this.http.get(requestUrl)
        .subscribe(
          response => {
            this.processResponse(
              response.text(),
              successCallback,
              errorCallback,
              offset);
          },
          error => {
            errorCallback(error.toString());
          }
        );
    }
  }

    allPosts(): Post[] {
        return this.posts; // TODO: Should this be cloned?
    }

  buildRequestUrl(offset: number): string {
    let requestUrl = URI({
      protocol: 'http',
      hostname: this.hostname,
      path: 'index.php',
      query: 'page=dapi&s=post&q=index',
    });

    let page = Math.round(offset / POSTS_PER_PAGE);

    // Add the page number.
    requestUrl.addQuery({ 'pid': page });

    // Add the number of posts per page. At the time of writing this defaults to 100 but we include
    // it in the URL query in case this varies between sites.
    requestUrl.addQuery({ 'limit': POSTS_PER_PAGE });

    // Add included and excluded tags to the search string.
    let tagString = '';
    if (this.options.tags && this.options.tags.length > 0) {
      tagString = this.options.tags.join(' ');
    }

    if (this.options.excludeTags && this.options.excludeTags.length > 0) {
      tagString += ' -' + this.options.excludeTags.join(' -');
    }

    if (tagString != '') {
      requestUrl.addQuery({ 'tags': tagString });
    }

    console.log(`request url: ${requestUrl}`);

    return requestUrl.toString();
  }

  processResponse(
    response: string,
    successCallback: (posts: Post[], more: boolean) => void,
    errorCallback: (message: string) => void,
    offset: number
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
      let counter = offset;
      let responsePosts = parsedData.post;

      // If running in a desktop browser the response string is going to be a
      // hardcoded list of 1000 posts so we need to manually slice according to
      // how the server would respond.
      if (this.platform.is('core')) {
        responsePosts = responsePosts.slice(counter, counter + POSTS_PER_PAGE);
      }

      for (let post of responsePosts) {
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
          tags: post.tags.trim().split(' '),
          index: counter,
        });

        counter += 1;
      }

      // Add loaded posts to the cached list of posts.
      Array.prototype.push.apply(this.posts, results);

      // Determine if all posts have been loaded.
      let more = this.posts.length < parsedData.count;

      successCallback(results, more);
    });
  }

  serialize(): any {
    return {
      provider: 'GelbooruProvider',
      hostname: this.hostname,
      options: this.options,
      posts: this.posts,
    };
  }

  deserialize(data: any) {
    this.hostname = data.hostname;
    this.options = data.options;
    this.posts = data.posts;
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
