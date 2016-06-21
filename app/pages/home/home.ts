import {Component} from '@angular/core';
import {NavController, Storage, SqlStorage} from 'ionic-angular';
import {GalleryPage} from '../gallery/gallery';
import {saveNavState, resetSavedState, tryRestoreState} from '../../save-restore';
import {LookupService} from '../../backends/lookup-service';
import {ImagePage} from '../../pages/image/image';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    siteInput: string = 'safebooru.org';

    constructor(
        private nav: NavController,
        private lookupService: LookupService
    ) {
    }

    submit() {
        // TODO: Validate url input before sending it to gallery page.
        this.nav.push(GalleryPage, {
            'hostname': this.siteInput,
            'options': {},
        });
    }

    ionViewLoaded() {
        tryRestoreState(
            this.nav,
            this.lookupService,
            (stateWasRestored) => {
                this.nav.viewDidEnter.subscribe(
                    (view) => {
                        console.log('view did enter:', view);
                        saveNavState(this.nav, this.lookupService);
                    },
                    (param) => { console.log(`view pushed error:`, param); },
                    (param) => { console.log(`view pushed complete:`, param); });
            });
    }

    ionViewDidEnter() {
        resetSavedState();
    }

    collectState() : any {
        return {
            siteInput: this.siteInput,
        };
    }
}
