import {IonicApp, App, NavController, Platform, Storage, SqlStorage} from 'ionic-angular';
import {HomePage} from './pages/home/home';
import {GalleryPage} from './pages/gallery/gallery';
import {ImagePage} from './pages/image/image';
import {LookupService} from './backends/lookup-service';

@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
    providers: [LookupService],
})
export class MyApp {
    rootPage: any = HomePage;
    nav: NavController;

    constructor(private app: IonicApp, private platform: Platform, private lookupService: LookupService) {
        platform.ready().then(() => {
            this.nav = this.app.getActiveNav();
            console.log(`this.nav: ${this.nav}`);
            this.tryRestoreState();
        });
    }

    tryRestoreState() {
        let storage = new Storage(SqlStorage);
        storage.get('navState').then((navState) => {
            let parsed = JSON.parse(navState);
            console.log(`last nav state:`);
            console.log(parsed);

            // RESTORE PROVIDERS ===========================

            this.lookupService.restoreProviders(parsed.providers);

            // RESTORE NAV STACK ===========================

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

            console.log('restore pages:');
            console.log(restorePages);

            this.nav.setPages(restorePages);
        });
    }
}
