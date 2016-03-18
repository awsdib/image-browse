# Image Browse

A cross-platform app for browsing image boards.

Image Browse is a work-in-progress app for browsing image hosting/sharing sites like
[Imgur](http://imgur.com/) and [Gelbooru](http://gelbooru.com/). It's cross platform and designed
to support a variety of websites. Currently only Gelbooru-based sites are targeted but as more of
the core functionality is implemented more sites will be added. To request functionality open an
issue with your request.

## Features

- Enter the site you want to browse on the home page to go to that site's gallery.
- View thumbnails in the gallery view, click on an image to see the image and its tags.
- Click on a tag when viewing an image to search for images with the same tag.
- Scroll to the bottom in the gallery view to load more images.

## Planned Features

- Swipe forever in the image view to keep loading images in the gallery.
- Favorite tags to quickly search for them later.
- Save images directly to your device.
- Save favorite sites and add them to your homepage.
- Search multiple sites at once.
- Filter out adult content and images with specific tags.

## Building And Running

Image Browse is build with the [Ionic Framework](http://ionicframework.com/), currently using the
[v2 beta](http://ionicframework.com/docs/v2/).

- To install ionic run `npm install -g ionic@beta`.
- To install typings (used to manage TypeScript definitions) run `npm install -g typings`.
- `cd` into the directory where you cloned the Image Browse repository.
- Run `npm install`.
- Run `typings install`.

With that you should be able to run Image Browse locally and on device:

- Run `ionic serve` to run in your desktop web browser with live reloading.
- Run `ionic run android` or `ionic run ios` to run on your browser.

Note that because we need to make web requests you can't browse live data when running locally.
Instead we use sample data to test all functionality offline. To test with live data you'll have to
run the app on a device.

## Contributing

All contributions are welcome! Make a pull request with the changes you'd like to include and I'll
review them. Once I've approved your changes and verified that they work I'll accept the PR.

All tasks are mentored, but the tasks marked [`difficulty: easy (hours)`](https://github.com/excaliburHisSheath/image-browse/issues?q=is%3Aopen+is%3Aissue+label%3A%22difficulty%3A+easy+%28hours%29%22)
are going to be the best tasks for new contributors. They usual require very little familiarity
with the language or the libraries we're using and have complete descriptions of all the steps
involved. If there's ever a task you want to tackle please let me know and I'll provide all the
help I can.
