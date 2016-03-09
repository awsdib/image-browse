import {Page} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  siteInput: string = '';

  submit() {
    console.log(`site address: ${this.siteInput}`);
  }
}
