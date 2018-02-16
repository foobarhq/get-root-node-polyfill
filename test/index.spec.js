'use strict';

var chai = require('chai');
var dirtyChai = require('dirty-chai');
var getRootNode = require('../index');

chai.use(dirtyChai);
var expect = chai.expect;

function supportsShadowRoot() {
  return typeof Element.prototype.attachShadow === 'function';
}

describe('Node.prototype.getRootNode', function describeGetRootNode() {

  var realmns = [];

  function createRealmn() {
    var iframe = document.createElement('iframe');
    iframe.src = window.location;
    document.body.appendChild(iframe);

    realmns.push(iframe);

    return iframe.contentWindow;
  }

  function createShadowRoot(document) {
    var node = document.createElement('div');
    document.body.appendChild(node);
    var shadowRoot = node.attachShadow({ mode: 'open' });
    var shadowNode = document.createElement('div');
    shadowRoot.appendChild(shadowNode);

    return { root: shadowRoot, node: shadowNode };
  }

  afterEach(function cleanupRealmns() {
    for (var i = 0; i < realmns.length; i++) {
      realmns[i].remove();
    }

    realmns = [];
  });

  describe('returns the root of detached trees', function testGetRootDetached() {

    function run(document) {
      var rootNode = document.createElement('div');
      var childNode = document.createElement('div');
      var descendantNode = document.createElement('div');

      rootNode.appendChild(childNode);
      childNode.appendChild(descendantNode);

      expect(getRootNode.call(descendantNode)).to.equal(rootNode);
    }

    it('current realmn', function inRealmn() {
      run(window.document);
    });

    it('cross-realmn', function outRealmn() {
      run(createRealmn().document);
    });
  });

  describe('returns the root of attached trees', function testGetRootAttached() {

    function run(document) {
      var rootNode = document.createElement('div');
      var childNode = document.createElement('div');
      var descendantNode = document.createElement('div');

      document.body.appendChild(rootNode);
      rootNode.appendChild(childNode);
      childNode.appendChild(descendantNode);

      expect(getRootNode.call(descendantNode)).to.equal(document);
    }

    it('current realmn', function inRealmn() {
      run(window.document);
    });

    it('cross-realmn', function outRealmn() {
      run(createRealmn().document);
    });
  });

  describe('returns itself if it is the root', function testGetSelf() {

    function run(document) {
      var detachedNode = document.createElement('div');

      expect(getRootNode.call(detachedNode)).to.equal(detachedNode);
      expect(getRootNode.call(document)).to.equal(document);
    }

    it('current realmn', function inRealmn() {
      run(window.document);
    });

    it('cross-realmn', function outRealmn() {
      run(createRealmn().document);
    });
  });

  describe('works with shadow roots', function testGetShadow() {

    function run(document) {
      var elems = createShadowRoot(document);
      expect(getRootNode.call(elems.node)).to.equal(elems.root);
    }

    it('current realmn', function inRealmn() {
      if (!supportsShadowRoot()) {
        this.skip();
        return;
      }

      run(window.document);
    });

    it('cross-realmn', function outRealmn() {
      if (!supportsShadowRoot()) {
        this.skip();
        return;
      }

      run(createRealmn().document);
    });
  });

  describe('"composed" option returns the shadow root\'s host\'s root', function testGetShadowsRoot() {

    function run(document) {
      var elems = createShadowRoot(document);
      expect(getRootNode.call(elems.node, { composed: true })).to.equal(document);
    }

    it('current realmn', function inRealmn() {
      if (!supportsShadowRoot()) {
        this.skip();
        return;
      }

      run(window.document);
    });

    it('cross-realmn', function outRealmn() {
      if (!supportsShadowRoot()) {
        this.skip();
        return;
      }

      run(createRealmn().document);
    });
  });

  describe('"composed" option defaults to false', function testComposed() {

    function run(document) {
      var elems = createShadowRoot(document);
      expect(getRootNode.call(elems.node)).to.equal(getRootNode.call(elems.node, { composed: false }));
    }

    it('current realmn', function inRealmn() {
      if (!supportsShadowRoot()) {
        this.skip();
        return;
      }

      run(window.document);
    });

    it('cross-realmn', function outRealmn() {
      if (!supportsShadowRoot()) {
        this.skip();
        return;
      }

      run(createRealmn().document);
    });
  });
});

describe('implement.js', function describeGetRootNode() {

  it('implements Node.prototype.getRootNode if it does not exist', function testGetRootDetached() {
    var isNative = typeof Node.prototype.getRootNode === 'function';

    require('../implement');

    if (isNative) {
      expect(Node.prototype.getRootNode).to.not.equal(getRootNode, 'native getRootNode has been overwritten');
    } else {
      expect(Node.prototype.getRootNode).to.equal(getRootNode, 'getRootNode hasn\'t been polyfilled');
    }
  });
});
