function newGetProductEndpoint(internalStorage) {
  return (shop, productId) => {
    return internalStorage.getProductPrice(shop, productId);
  };
}

module.exports = newGetProductEndpoint;
