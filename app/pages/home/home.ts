import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GalleryPage} from '../gallery/gallery';
import {saveNavState} from '../../save-restore';
import {LookupService} from '../../backends/lookup-service';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    siteInput: string = 'safebooru.org';

    constructor(
        private nav: NavController,
        private lookup: LookupService
    ) {
    }

    submit() {
        // TODO: Validate url input before sending it to gallery page.
        this.nav.push(GalleryPage, {
            'hostname': this.siteInput,
            'options': {},
        });
    }

    ionViewWillEnter() {
        saveNavState(this.nav, this.lookup);
    }

    collectState() : any {
        return {
            siteInput: this.siteInput,
        };
    }
}
