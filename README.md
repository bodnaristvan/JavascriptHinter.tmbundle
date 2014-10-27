JavascriptHinter.tmbundle
===============

This is a TextMate 2 JSHint and JSCS plugin using the installed version of JSHint and JSCS.

![Screenshot of JavascriptHinter.tmbundle running in TextMate with errors in the gutter -- note the visual glitches](https://cloud.githubusercontent.com/assets/710358/4801130/a284aa1c-5e2d-11e4-9a9a-2153961a88c8.png)


### Installation ###

**Requirements:** 

- [Node.js][nodejs]
- [TextMate 2][textmate]
- [JsHint][jshint]
- [JavaScript Code Style checker][jscs]

[nodejs]: http://www.nodejs.org
[textmate]: https://github.com/textmate/textmate
[jshint]: http://jshint.com/
[jscs]: https://github.com/jscs-dev/node-jscs

**Installation:**

1.  Clone the repository `git clone git://github.com/bodnaristvan/JavascriptHinter.tmbundle.git`.
2.  Go to the directory `cd JavascriptHinter.tmbundle`.
3.  Run `make`
4.  Run `open .` in the same directory to install the bundle
5.  If you run into problems with node not found while running the plugin, check out this comment: https://github.com/bodnaristvan/JSHint.tmbundle/issues/1#issuecomment-42533685
6.  Make sure you have `jshint` and `jscs` installed and available for the user: `npm install -g jshint jscs`

### Configuration ###

The bundle will use the default installed jshint and jscs executables, and the existing configuration in the project or in home directory.
The bundle is bound to the `^l` key by default in javascript mode, so make sure you disable previous bundles that were using this combo (like Jshint.tmbundle for example)

 
### Presentation ###

By default, Textmate2 shows any bundle output in a popup window, but also supports a sidebar as shown in the screenshot above.

To switch to using sidebar..

`defaults write com.macromates.TextMate.preview htmlOutputPlacement right`

Or switch back to window

`defaults write com.macromates.TextMate.preview htmlOutputPlacement window`

