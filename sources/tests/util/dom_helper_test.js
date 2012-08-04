
function UtilDomHelperTest() {
  this.document = {};
  this.dom_helper = new util.DomHelper(this.document);
}
registerTestSuite(UtilDomHelperTest);

UtilDomHelperTest.prototype.Get = function() {
  var dom = {};
  this.document.getElementById = createMockFunction();
  expectCall(this.document.getElementById)('the_id')
    .willOnce(returnWith(dom));
  expectEq(dom, this.dom_helper.get('the_id'));
};

UtilDomHelperTest.prototype.AddEventListener = function() {
  var dom = {};
  dom.addEventListener = createMockFunction();
  var func_this;
  var func_arg;

  var that = {};
  var func = function(arg) {
    func_this = this;
    func_arg = arg;
  };

  expectCall(dom.addEventListener)('click', _, true)
    .willOnce(function(t, f, b) {f(1)});
  this.dom_helper.addEventListener(dom, 'click', that, func);
  expectEq(that, func_this);
  expectEq(1, func_arg);
};

UtilDomHelperTest.prototype.GetValue = function() {
  var dom = {};
  dom.value = 'test';
  expectEq('test', this.dom_helper.getValue(dom));
};

UtilDomHelperTest.prototype.CreateElement = function() {
  var dom = {};
  this.document.createElement = createMockFunction();
  expectCall(this.document.createElement)('div')
    .willOnce(returnWith(dom));
  expectEq(dom, this.dom_helper.createElement('div'));
};

UtilDomHelperTest.prototype.CreateTextNode = function() {
  var dom = {};
  this.document.createTextNode = createMockFunction();
  expectCall(this.document.createTextNode)()
    .willOnce(returnWith(dom));
  expectEq(dom, this.dom_helper.createTextNode());
  expectEq('', dom.data);
};

UtilDomHelperTest.prototype.AppendData = function() {
  var dom = {};
  dom.appendData = createMockFunction();
  expectCall(dom.appendData)('test').times(1);
  this.dom_helper.appendData(dom, 'test');
};

UtilDomHelperTest.prototype.AppendChild = function() {
  var dom = {}, dom2 = {};
  dom.appendChild = createMockFunction();
  expectCall(dom.appendChild)(dom2).times(1);
  this.dom_helper.appendChild(dom, dom2);
};

UtilDomHelperTest.prototype.RemoveChildren = function() {
  var dom = {};
  var children = [{}, {}, {}, {}];
  dom.firstChild = children[0];
  dom.hasChildNodes = createMockFunction();
  dom.removeChild = createMockFunction();
  expectCall(dom.hasChildNodes)().willRepeatedly(
    function() {return children.length != 0;});
  expectCall(dom.removeChild)(_).willRepeatedly(
    function (a) {
      for (var i = 0; i < children.length; i++) {
        if (children[i] === a) {
          children.splice(i, 1);
          dom.firstChild = children[0];
          return a;
        }
      }
    });
  this.dom_helper.removeChildren(dom);
  expectEq(0, children.length);
};
