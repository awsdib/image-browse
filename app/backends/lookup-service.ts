import {Platform} from 'ionic-angular';
import {Http} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Post} from '../pages/gallery/gallery';
import {GelbooruProvider} from './gelbooru-provider';

export interface Provider {
  hostname: string;
  options: Options;

  getPosts(
    offset: number,
    successCallback: (posts: Post[], more: boolean) => void,
    errorCallback: (message: string) => void);
}

// TODO: Make this into a class.
export interface Options {
  tags?: string[],
  excludeTags?: string[],
}

@Injectable()
export class LookupService {
  constructor(private platform: Platform, private http: Http) {}

  getProvider(hostname: string, options: Options): Provider {
    for (let provider of _providers) {
      // TODO: Do more intelligent comparison of options objects.
      if (provider.hostname == hostname && JSON.stringify(provider.options) == JSON.stringify(options)) {
        return provider;
      }
    }

    // No provider exists yet so we create one.
    switch (hostname) {
      case 'rule34.xxx':
      case 'safebooru.org':
        let provider = new GelbooruProvider(this.platform, this.http);
        provider.hostname = hostname;
        provider.options = options;
        _providers.push(provider);
        return provider;
      default:
        return null;
    }
  }
}

var _providers: Provider[] = [];
