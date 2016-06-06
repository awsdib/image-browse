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

    constructor(private platform: Platform, private http: Http) {
        console.log('constructing new lookup service');
    }

    getProvider(hostname: string, options: Options): Provider {
        for (let provider of this.providers) {

            // TODO: Do more intelligent comparison of options objects.
            if (provider.hostname == hostname && JSON.stringify(provider.options) == JSON.stringify(options)) {
                console.log('reusing existing provider');
                return provider;
            }
        }

        // No provider exists yet so we create one.
        switch (hostname) {
            case 'rule34.xxx':
            case 'safebooru.org':
                console.log('creating new GelbooruProvider');
                let provider = new GelbooruProvider(this.platform, this.http);
                provider.hostname = hostname;
                provider.options = options;
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
                    // TODO: Instantiate provider.
                    break;
            }
        }
    }
}
