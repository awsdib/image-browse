import {IonicApp, App, NavController, Platform, Storage, SqlStorage} from 'ionic-angular';
import {HomePage} from './pages/home/home';
import {GalleryPage} from './pages/gallery/gallery';
import {ImagePage} from './pages/image/image';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(app: IonicApp, platform: Platform) {
    platform.ready().then(() => {
      let nav: NavController = app.getActiveNav();

      let storage = new Storage(SqlStorage);
      storage.get('counter').then((counter) => {
        if (counter) {
          console.log(`old counter value: ${counter}`);
          storage.set('counter', parseInt(counter, 10) + 1).then((value) => { console.log(value); });
        } else {
          console.log('no existing counter, setting to 0');
          storage.set('counter', 0).then((value) => { console.log(value); });
        }
      });

      // TODO: Load app state from SqlStorage.
      const SAMPLE_STATE_DATA = [
        {
          page: "HomePage",
          data: {
            siteInput: "safebooru.org"
          },
        },
        {
          page: "GalleryPage",
          data: {
            hostname: "safebooru.org",
            options: {},
          },
        },
        {
          page: "ImagePage",
          data: {
            hostname: "safebooru.org",
            posts: [{
              display: "http://safebooru.org/samples/1639/sample_de35f0d63b52aa43987736644de8965427b68747.jpg",
              image: "http://safebooru.org/images/1639/de35f0d63b52aa43987736644de8965427b68747.jpg",
              index: 0,
              loaded: true,
              sample: "http://safebooru.org/samples/1639/sample_de35f0d63b52aa43987736644de8965427b68747.jpg",
              tags: ["butts", "other_butts"],
              thumbnail: "http://safebooru.org/thumbnails/1639/thumbnail_de35f0d63b52aa43987736644de8965427b68747.jpg",
            }],
            options: {},
            index: 0,
          },
        }
      ];
      const SAMPLE_PROVIDER_DATA = [
        {
          provider: 'GelbooruProvider',
          posts: [],
        }
      ];

      let restorePages = SAMPLE_STATE_DATA.map(page => {
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
}
