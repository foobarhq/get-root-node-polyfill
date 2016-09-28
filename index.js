'use strict';

// Node getRootNode(optional GetRootNodeOptions options);

/**
 * Returns the context object’s shadow-including root if options’s composed is true.
 * Returns the context object’s root otherwise.
 *
 * The root of an object is itself, if its parent is null, or else it is the root of its parent.
 *
 * The shadow-including root of an object is its root’s host’s shadow-including root,
 * if the object’s root is a shadow root, and its root otherwise.
 *
 * https://dom.spec.whatwg.org/#dom-node-getrootnode
 *
 * @memberof Node.prototype
 */
function getRootNode(opt) {
  var composed = typeof opt === 'object' && Boolean(opt.composed);

  return composed ? getShadowIncludingRoot(this) : getRoot(this);
}

function getShadowIncludingRoot(node) {
  var root = getRoot(node);

  if (isShadowRoot(root)) {
    return getShadowIncludingRoot(root.host);
  }

  return root;
}

function getRoot(node) {
  if (node.parentNode != null) {
    return getRoot(node.parentNode);
  }

  return node;
}

function isShadowRoot(node) {
  return typeof ShadowRoot === 'function' && node instanceof ShadowRoot;
}

if (!Object.prototype.hasOwnProperty.call(Node.prototype, 'getRootNode')) {
  Object.defineProperty(Node.prototype, 'getRootNode', {
    enumerable: false,
    configurable: false,
    value: getRootNode,
  });
}

if (typeof module === 'object' && module.exports) {
  module.exports = getRootNode;
}