function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  let data = [];
  filter.ondata = event => {
    data.push(event.data);
  };

  filter.onstop = event => {
    let str = "";
    for (let buffer of data) {
      str += decoder.decode(buffer, {stream: true});
    }
    str += decoder.decode(); // end-of-stream

    // Just change any instance of WebExtension Example in the HTTP response
    // to WebExtension WebExtension Example.
    console.log("find and replace postID");
    str = str.replace(/getParam\(\"postID\"\)/g, 'getParam("po")');
    filter.write(encoder.encode(str));
    filter.close();
  };
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["https://program-think.blogspot.com/*"], types: ["main_frame"]},
  ["blocking"]
);
