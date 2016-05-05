import {IonicApp, App, NavController, Platform} from 'ionic-angular';
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
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)

      let nav: NavController = app.getActiveNav();

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
            posts: [{
              display: "http://safebooru.org/samples/1639/sample_de35f0d63b52aa43987736644de8965427b68747.jpg",
              image: "http://safebooru.org/images/1639/de35f0d63b52aa43987736644de8965427b68747.jpg",
              index: 0,
              loaded: true,
              sample: "http://safebooru.org/samples/1639/sample_de35f0d63b52aa43987736644de8965427b68747.jpg",
              tags: [],
              thumbnail: "http://safebooru.org/thumbnails/1639/thumbnail_de35f0d63b52aa43987736644de8965427b68747.jpg",
            }],
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
              tags: [],
              thumbnail: "http://safebooru.org/thumbnails/1639/thumbnail_de35f0d63b52aa43987736644de8965427b68747.jpg",
            }],
            options: {},
            activePosts: [{
              display: "http://safebooru.org/samples/1639/sample_de35f0d63b52aa43987736644de8965427b68747.jpg",
              image: "http://safebooru.org/images/1639/de35f0d63b52aa43987736644de8965427b68747.jpg",
              index: 0,
              loaded: true,
              sample: "http://safebooru.org/samples/1639/sample_de35f0d63b52aa43987736644de8965427b68747.jpg",
              tags: [],
              thumbnail: "http://safebooru.org/thumbnails/1639/thumbnail_de35f0d63b52aa43987736644de8965427b68747.jpg",
            }],
          },
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
      nav.setPages(restorePages);
    });
  }
}
