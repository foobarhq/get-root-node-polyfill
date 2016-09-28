if (!Object.prototype.hasOwnProperty.call(Node.prototype, 'getRootNode')) {
  Object.defineProperty(Node.prototype, 'getRootNode', {
    enumerable: false,
    configurable: false,
    value: require('./index'),
  });
}
