import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GalleryPage } from '../pages/gallery/gallery';
import { GalleryItemsPage } from '../pages/gallery-items/gallery-items';
import { GalleryComponent } from '../components/gallery/gallery';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GalleryPage,
    GalleryItemsPage,
    GalleryComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GalleryPage,
    GalleryItemsPage,
    GalleryComponent,
  ],
  providers: [],
})
export class AppModule {}
