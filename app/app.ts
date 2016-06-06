import {IonicApp, App, NavController, Platform, Storage, SqlStorage} from 'ionic-angular';
import {SaveRestoreService} from './save-restore-service';
import {HomePage} from './pages/home/home';
import {LookupService} from './backends/lookup-service';

@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
    providers: [LookupService],
})
export class MyApp {
    rootPage: any = HomePage;

    constructor(app: IonicApp, platform: Platform) {
        platform.ready().then(() => {
            // saveRestoreService.tryRestoreState();
        });
    }
}
