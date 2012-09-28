
function UtilJsLoaderTest() {
  this.dom_helper = createMockInstance(util.DomHelper);
  this.js_loader = new util.JsLoader(this.dom_helper);
}
registerTestSuite(UtilJsLoaderTest);

UtilJsLoaderTest.prototype.Load = function() {
  var body = {}, dom = {};
  var url = "http://醤油取ってくれ.com/";
  expectCall(this.dom_helper.createElement)('script')
    .willOnce(returnWith(dom));
  expectCall(this.dom_helper.setCharset)(dom, 'utf-8');
  expectCall(this.dom_helper.setSrc)(dom, url);
  expectCall(this.dom_helper.getBody)().willOnce(returnWith(body));
  expectCall(this.dom_helper.appendChild)(body, dom);

  this.js_loader.load(url);
};
