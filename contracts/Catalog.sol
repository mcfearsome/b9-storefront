pragma solidity ^0.4.11;

import './Mortal.sol';
import './Adminable.sol';

contract Catalog is Mortal {
  struct Product {
    uint price; // In wei
    uint available;
    bool exists;
    bool active;
  }
  uint public numProducts;
  mapping(uint => Product) public products;
  uint[] public productIds;


  event ProductCreated(uint indexed id);
  event SaleCommitted(uint indexed id, uint quantity);

  modifier mustExist(uint id) {
    require(productExists(id));
    _;
  }

  modifier mustBeAvailable(uint id, uint quantity) {
    uint result = products[id].available - quantity;
    require(result >= 0 && result < products[id].available);
    _;
  }

  modifier mustBeActive(uint id) {
    require(products[id].active);
    _;
  }

  function addProduct(uint id, uint price, uint available)
    onlyOwner()
    external
    returns(bool success)
  {
    require(id != 0);
    require(!productExists(id));
    products[id] = Product(price, available, true, true);
    numProducts++;
    productIds.push(id);
    ProductCreated(id);
    return true;
  }

  function commitSale(uint id, uint quantity)
    onlyOwner()
    mustExist(id)
    mustBeAvailable(id, quantity)
    mustBeActive(id)
    returns(bool success)
  {
    products[id].available -= quantity;
    SaleCommitted(id, quantity);
    return true;
  }

  function productActive(uint id) constant external returns(bool) {
      return products[id].active;
  }

  function productPrice(uint id) constant external returns(uint) {
      return products[id].price;
  }

  function productExists(uint id) constant returns(bool success) {
    return products[id].exists;
  }

  function productIdsLength() constant returns(uint) {
    return productIds.length;
  }
}
