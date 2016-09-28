var chai = require('chai');
var dirtyChai = require('dirty-chai');
var getRootNode = require('../index');

chai.use(dirtyChai);
var expect = chai.expect;

describe('Node.prototype.getRootNode', function describeGetRootNode() {

  it('returns the root of detached trees', function testGetRootDetached() {
    var rootNode = document.createElement('div');
    var childNode = document.createElement('div');
    var descendantNode = document.createElement('div');

    rootNode.appendChild(childNode);
    childNode.appendChild(descendantNode);

    expect(getRootNode.call(descendantNode)).to.equal(rootNode);
  });

  it('returns the root of attached trees', function testGetRootDetached() {
    var rootNode = document.createElement('div');
    var childNode = document.createElement('div');
    var descendantNode = document.createElement('div');

    document.body.appendChild(rootNode);
    rootNode.appendChild(childNode);
    childNode.appendChild(descendantNode);

    expect(getRootNode.call(descendantNode)).to.equal(document);
  });

  it('returns itself if it is the root', function testGetRoot() {
    var detachedNode = document.createElement('div');

    expect(getRootNode.call(detachedNode)).to.equal(detachedNode);
    expect(getRootNode.call(document)).to.equal(document);
  });

  if (typeof Element.prototype.attachShadow === 'function') {
    var node = document.createElement('div');
    var shadowRoot = node.attachShadow({ mode: 'open' });
    var shadowNode = document.createElement('div');
    shadowRoot.appendChild(shadowNode);

    it('works on shadow roots', function testGetRoot() {
      expect(getRootNode.call(shadowNode)).to.equal(shadowRoot);
    });

    it('composed option defaults to false', function testGetRoot() {
      expect(getRootNode.call(shadowNode))
        .to.equal(getRootNode.call(shadowNode, { composed: false }));
    });

    it('composed option returns the shadow root\'s host\'s root', function testGetRoot() {
      expect(getRootNode.call(shadowNode, { composed: true })).to.equal(node);
    });
  }
});
