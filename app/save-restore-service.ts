import {NavController, Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {LookupService} from './backends/lookup-service';
import {HomePage} from './pages/home/home';
import {GalleryPage} from './pages/gallery/gallery';
import {ImagePage} from './pages/image/image';

@Injectable()
export class SaveRestoreService {
    tryRestoreState() {
        let storage = new Storage(SqlStorage);
        storage.get('navState').then((navState) => {
            let parsed = JSON.parse(navState);
            console.log(`last nav state:`);
            console.log(parsed);

            let restorePages = parsed.navStack.map(page => {
                let pageType;
                if (page.page == "HomePage") {
                    pageType = HomePage;
                } else if (page.page == "GalleryPage") {
                    pageType = GalleryPage;
                } else if (page.page == "ImagePage") {
                    pageType = ImagePage;
                } else {
                    // TODO: Throw an exception or something.
                }

                let params = <any>page.data;
                params.restore = true;
                return {
                    page: pageType,
                    params: params,
                };
            });
            // nav.setPages(restorePages);
        });
    }

    saveNavState(nav: NavController, lookupService: LookupService) {
        let navStack = [];
        for (let index = 0; index < nav.length(); index += 1) {
            let view = nav.getByIndex(index);
            let navData = {
                page: view.instance.constructor.name,
                data: view.instance.collectState(),
            };
            navStack.push(navData);
        }

        let dataString = JSON.stringify({
            navStack: navStack,
            providers: lookupService.getProviderData(),
        });

        let storage = new Storage(SqlStorage);
        storage.set('navState', dataString);
    }
}
