importScripts('babel.min.js');
importScripts('ua-parser.min.js');

/**
 * Transpile a js file into ES5
 * @param  {String} input The file to transpile
 * @return {String}       The transpiled file
 */
const transform = (input) => Babel.transform(input, { presets: ['es2015'] }).code;

/**
 * Test of the requested object is a javascript file
 * @param  {Request} request The request
 * @return {Boolean}         True if the object a javascript file
 */
const isRequestJS = (request) => {
  if (request && request.url) {
    const url = request.url;
    return url.slice(url.length - 2) === 'js' ? true : false;
  }

  return false;
}

/**
 * Check if the current browser supports ES6
 *
 * TODO: Make this extensible
 * @return {Boolean}
 */
const oldBrowser = () => {
  const ua = UAParser(navigator.userAgent);

  /**
   * Browsers with native ES6 support
   * TODO: Add more to this list :(
   *
   * http://kangax.github.io/compat-table/es6/
   * @type {Object.<String>}
   */
  const goodBrowsers = {
    'Chrome': '52',
    'Opera': '39',
  };

  /**
   * Version of browser that supports ES6
   * @type {Number}
   */
  const validVersion = Number(goodBrowsers[ua.browser.name]);

  if (validVersion && Number(ua.browser.major) >= validVersion) {
    return false;
  }

  return true;
}

this.onfetch = (event) => {
  const isJS = isRequestJS(event.request);
  if (isJS && oldBrowser()) {
   event.respondWith(fetch(event.request)
    .then(response => response.blob())
    .then((response) => {
      const reader = new FileReader();
      const p = new Promise((resolve, reject) => {
        reader.onload = ({target: {result}}) => {
          // Transform code
          const res = transform(result);
          resolve(res);
        };
      });
      reader.readAsText(response);
      return p;
    })
    .then(res => new Response(res))
    )

  } else {
    // Pass request through unmodified
    event.respondWith(fetch(event.request).then(response => response));
  }
};
