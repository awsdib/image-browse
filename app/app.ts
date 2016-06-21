import {Component} from '@angular/core';
import {ionicBootstrap, App, NavController, Platform, Storage, SqlStorage} from 'ionic-angular';
import {HomePage} from './pages/home/home';
import {LookupService} from './backends/lookup-service';

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
})
export class MyApp {
    rootPage: any = HomePage;
    nav: NavController;
}

ionicBootstrap(
    MyApp, // Root component.
    [LookupService], // Providers.
    {}); // Config.
