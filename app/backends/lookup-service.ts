import {Platform} from 'ionic-angular';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Post} from '../pages/gallery/gallery';
import {GelbooruProvider} from './gelbooru-provider';

export interface Provider {
    hostname: string;
    options: Options;

    getPosts(
        offset: number,
        successCallback: (posts: Post[], more: boolean) => void,
        errorCallback: (message: string) => void);

    allPosts(): Post[];

    serialize(): any;
    deserialize(data: any);
}

// TODO: Make this into a class.
export interface Options {
    tags?: string[],
    excludeTags?: string[],
}

@Injectable()
export class LookupService {
    providers: Provider[] = [];

    constructor(private platform: Platform, private http: Http) {}

    getProvider(hostname: string, options: Options): Provider {
        for (let provider of this.providers) {

            // TODO: Do more intelligent comparison of options objects.
            if (provider.hostname == hostname && JSON.stringify(provider.options) == JSON.stringify(options)) {
                return provider;
            }
        }

        // No provider exists yet so we create one.
        switch (hostname) {
            case 'rule34.xxx':
            case 'safebooru.org':
                let provider = new GelbooruProvider(hostname, options, this.platform, this.http);
                this.providers.push(provider);
                return provider;
            default:
                return null;
        }
    }

    getProviderData(): any[] {
        let result = [];
        for (let provider of this.providers) {
            result.push(provider.serialize());
        }
        return result;
    }

    restoreProviders(dataList: any[]) {
        this.providers = [];
        for (let data of dataList) {
            switch (data.provider) {
                case 'GelbooruProvider':
                    let provider = new GelbooruProvider(data.hostname, data.options, this.platform, this.http);
                    provider.deserialize(data);
                    this.providers.push(provider);
                    break;
            }
        }
    }
}
