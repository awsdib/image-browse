import {Modal, NavController, NavParams, Page, ViewController} from 'ionic-angular';
import * as gallery from '../gallery/gallery';
import {Options} from '../../backends/gelbooru-service';

@Page({
  templateUrl: 'build/pages/search-modal/search-modal.html',
})
export class SearchModal {
  hostname: string;
  options: Options;

  editTags: any[] = [];
  editExcludeTags: any[] = [];

  constructor(
    private nav: NavController,
    private navParams: NavParams
  ) {
    this.hostname = navParams.get('hostname');
    this.options = navParams.get('options');

    if (this.options.tags != null)
    {
      for (let tag of this.options.tags) {
        this.editTags.push({
          text: tag,
        });
      }
    }
  }

  onClose() {
    this.nav.pop();
  }

  onSearch() {
    // Create a new Options from the edited tags.
    let options = {
      tags: this.editTags.map(tag => tag.text),
      excludeTags: this.options.excludeTags,
    };

    console.log("options: ");
    console.log(options);

    // TODO: Validate url input before sending it to gallery page.
    this.nav.pop().then(() => {
      this.nav.push(gallery.GalleryPage, {
        'hostname': this.hostname,
        'options': options,
      });
    });
  }
}
