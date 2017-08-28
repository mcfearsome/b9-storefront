pragma solidity ^0.4.11;

import './Mortal.sol';
import './Adminable.sol';
import './Catalog.sol';

contract StoreFront is Mortal, Adminable {
  Catalog public catalog;

  event ProductPurchased(address indexed buyer, uint indexed productId, uint price);

  function StoreFront() {
    catalog = new Catalog();
  }

  function addProductToCatalog(uint id, uint price, uint available)
    onlyAdmin()
    returns(bool success)
  {
    success = catalog.addProduct(id, price, available);
  }

  function purchaseProduct(uint id) payable returns(bool success) {
    require(catalog.productExists(id));
    require(catalog.productActive(id));
    require(msg.value == catalog.productPrice(id));
    success = catalog.commitSale(id, 1);
    if(success) {
      ProductPurchased(msg.sender, id, msg.value);
    }
  }

  function withdraw() onlyOwner() {
    msg.sender.transfer(this.balance);
  }

  function() onlyOwner() payable {}
}
