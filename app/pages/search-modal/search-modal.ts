import {Component} from '@angular/core';
import {Modal, NavController, NavParams, ViewController} from 'ionic-angular';
import * as gallery from '../gallery/gallery';
import {Options} from '../../backends/lookup-service';

@Component({
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

    if (this.options.excludeTags != null)
    {
      for (let tag of this.options.excludeTags) {
        this.editExcludeTags.push({
          text: tag,
        });
      }
    }
  }

  onAddTag() {
    this.editTags.push({text: ""});
  }

  onRemoveTag(tag: any) {
    let index = this.editTags.indexOf(tag);
    this.editTags.splice(index, 1);
  }

  onAddExcludeTag() {
    this.editExcludeTags.push({text: ""});
  }

  onRemoveExcludeTag(tag: any) {
    let index = this.editExcludeTags.indexOf(tag);
    this.editExcludeTags.splice(index, 1);
  }

  onClose() {
    this.nav.pop();
  }

  onSearch() {
    // Create a new Options from the edited tags.
    let options = {
      tags: this.editTags.map(tag => tag.text),
      excludeTags: this.editExcludeTags.map(tag => tag.text),
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
