import {NavController, Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {LookupService} from './backends/lookup-service';
import {HomePage} from './pages/home/home';
import {GalleryPage} from './pages/gallery/gallery';
import {ImagePage} from './pages/image/image';

export function saveNavState(nav: NavController, lookupService: LookupService) {
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
