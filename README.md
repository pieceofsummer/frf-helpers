FrF Helpers
===========

Browser extension for friendfeed.com.
Supported browsers are: Chrome, Firefox, Safari.

Project goal is to make images show in browser instead of downloading them (bug in server headers). 
Extension makes images either show in DIV on the same page (dismissable by click/esc), or show in a new page (in-package html page) with zooming function.

Also the latest build adds support for server-side per-user comments.


Building for Chrome
-------------------

You need to copy (or hardlink) files from ./shared to ./chrome subdirectory. 
After that, you may either zip it and post to Chrome Web Store, or pack into stand-alone CRX package at Extensions page.

Building for Safari
-------------------

You need to copy (or hardlink) files from ./shared to ./safari/FrF.safariextension subdirectory
(Safari ext builder doesn't support symbolic links, and git doesn't support hard links).
Also you need a Safari developer certificate installed to package and distribute an extension.

Building for Firefox
--------------------

You need to copy (or hardlink) files from ./shared to ./firefox/data subdirectory. 
After that you may either use standalone SDK to build an extension, or online extension bulider to upload folder contents and then download extension package.
