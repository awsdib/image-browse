import {NavController, Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {LookupService} from './backends/lookup-service';
import {HomePage} from './pages/home/home';
import {GalleryPage} from './pages/gallery/gallery';
import {ImagePage} from './pages/image/image';

// TODO: I'd like to be able to have SaveRestore be an injectable class so the nav controller and
// lookup service could be cached. That would make it easier to save the state whenever the apps
// state changed in a meaningful way. The issue is that, as far as I know, it would have to be a
// component in order to get injected with the correct nav controller; If we just mark it as
// @Injectable() then it will either not get the right nav controller or injection will fail
// altogether.

export function saveNavState(nav: NavController, lookupService: LookupService) {
    console.groupCollapsed('Saving nav state');
    console.groupCollapsed('Current nav stack');
    for (let index = 0; index < nav.length(); index += 1) {
        let view = nav.getByIndex(index);
        console.log(`view ${index} is loaded: ${view.isLoaded()}`, view);
    }
    console.groupEnd();

    let navStack = [];
    for (let index = 0; index < nav.length(); index += 1) {
        let view = nav.getByIndex(index);

        let data;
        if (view.isLoaded()) {
            data = view.instance.collectState();
        } else {
            data = view.data;
        }

        let navData = {
            page: view.componentType.name,
            data: data,
        };
        navStack.push(navData);
    }

    let navState = {
        navStack: navStack,
        providers: lookupService.getProviderData(),
    };
    console.log('saving nav state:', navState);
    let dataString = JSON.stringify(navState);

    let storage = new Storage(SqlStorage);
    storage.set('navState', dataString);
    console.groupEnd();
}

export function tryRestoreState(nav: NavController, lookupService: LookupService, onComplete: (bool) => void) {
    let storage = new Storage(SqlStorage);
    storage.get('navState').then((navState) => {
        if (!navState) {
            console.log('No saved nav state to restore');
            onComplete(false);
            return;
        }

        let parsed = JSON.parse(navState);
        console.log(`last nav state:`, parsed);

        // RESTORE PROVIDERS ===========================

        lookupService.restoreProviders(parsed.providers);

        // RESTORE NAV STACK ===========================

        let restorePages = [];
        for (let page of parsed.navStack) {
            let pageType;
            if (page.page == "HomePage") {
                // TODO: Restore HomePage.
                continue;
            } else if (page.page == "GalleryPage") {
                pageType = GalleryPage;
            } else if (page.page == "ImagePage") {
                pageType = ImagePage;
            } else {
                // TODO: Throw an exception or something.
                console.log(`Unknown page type: ${page.page}`);
            }

            let params = <any>page.data;
            params.restore = true;
            restorePages.push({
                page: pageType,
                params: params,
            });
        }

        if (restorePages.length > 0) {
            nav.insertPages(1, restorePages);
        }

        onComplete(true);
    });
}

export function resetSavedState() {
    let storage = new Storage(SqlStorage);
    storage.remove('navState');
}
