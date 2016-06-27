#wp-boilerplate

##Description
wp-boilerplate is a simple WordPress starter theme and is licensed under the GNU General Public License (see COPYING for terms).

It provides support for building a WordPress theme using Jade, SASS and es6 javascript.

It includes Gulp tasks for development(build - produces css maps, doesn't uglify/minify css or js files), production(dist - doesn't produce css maps, uglifies/minifies css,js and php files) and linting(checks).
Gulp tasks will send errors to the console and continue.

To help prevent bloat in your created asset files, you should only include Bootstrap javascript modules that are actually needed (as referenced in /gulpfile.js).
You should only include CSS components that are actually needed (as referenced in src/sass/theme.scss).

Includes Typescript definition files for jQuery and Twitter Bootstrap.

Includes .vscode/tasks.json for use with [Visual Studio Code](https://code.visualstudio.com/). This allows you to run the npm build task using the key combination: cmd+shift+B or ctrl+shift+B.

---

##Standards And Accessibility
Generated HTML from the compiled PHP pages validate with the [W3C Markup Validation Service](https://validator.w3.org/).

[A11y](http://a11yproject.com/) tested for Headings, Contrast, Link text, Labels and image alt-text using [tota11y](https://github.com/Khan/tota11y) in-Browser.

Makes use of Bootstrap's responsive components.

---

##Installation
Installation requires [node](https://nodejs.org/en/), [Bower](https://bower.io/) and [Typings](https://github.com/typings/typings).

- clone the [git repo](https://github.com/lrs/wp-boilerplate.git) to a local directory.
- Replace all occurences of 'custom_theme' in the src/static/pages/functions.php with the name of your theme.
- Replace all references to 'wp-boilerplate' in the src/static/pages/style.css with those of your theme.
- Install Nodejs, Bower and Typings if you haven't done so already.

### Run the following shell commands
- $ typings install
  - installs definitions for jQuery and Bootstrap.
- $ bower install
  - installs Bootstrap-sass (also includes jQuery) and Font-Awesome components.
- $ npm install
  - installs modules and runs the postinstall script to copy static files from /src to /dist, compile source files and run linting tasks.
  - (remember; patience is a virtue!)

You can now zip up the dist/ folder and upload as a theme to your WordPress installation!

###The next steps are optional and depend on your work flow
- $ gulp publish
  - use this optional Gulp task to copy files from the dist/ folder to the path you specify in the publishPath variable in gulpfile.js.
- $ npm build
  - watch for changes and compile source files as you edit then save them.

- src/js/tools.js contains some unobtrusive example methods.
  - If you want to use them, you should change the ROOT_URL variable at the top of src/js/tools.js to the url of you home page.
---

##Files
The following static files will be copied from /src/static to /dist:
- src/static/pages/
  - functions.php
  - wp_bootstrap_navwalker.php
  - screenshot.png
  - style.css
    - -> /dist
- src/static/lang/
  - default.pot
    - -> /dist/languages
    - The contents of this file may change considerably and is included purely as an example.
- src/static/js/
  - shiv-respond.js
    - -> /dist/assets/js
- src/static/img/
  - avatar.png
  - brand-logo.png
  - favicon.ico
    - -> /dist/assets/img
- src/static/fonts/
  - fontawesome
  - glyphicons
    - -> /dist/assets/fonts

The following files are created from the Gulp build task:

###pages
- 404
- archive
- comments
- footer
- header
- index
- page
- page-home
- search
- searchform
- sidebar

###template-parts
- content
- content-none
- content-page

###assets\css
- theme.css

###assets\js
- theme.js

###assets\maps
- theme.css.map

---

##Recommended Plugins
- [Akismet](https://wordpress.org/plugins/akismet/)
- [Wordfence](https://wordpress.org/plugins/wordfence/)
- [WP-DBManager](https://wordpress.org/plugins/wp-dbmanager/)
- [iThemes Security](https://wordpress.org/plugins/better-wp-security/)
- [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/)
- [Custom Post Type UI](https://wordpress.org/plugins/custom-post-type-ui/)
- [Contact Form 7](https://wordpress.org/plugins/contact-form-7/)

---

##Licence

Copyright (C) 2016  [Design-Fu](http://design-fu.com/).

wp-boilerplate is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, version 3 of the License.

wp-boilerplate is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with wp-boilerplate.  If not, see http://www.gnu.org/licenses