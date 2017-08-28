pragma solidity ^0.4.11;

import './Owned.sol';

contract Adminable is Owned {
  mapping(address => bool) public admins;

  function Adminable() {
    admins[msg.sender] = true;
  }

  modifier onlyAdmin() {
    require(admins[msg.sender]);
    _;
  }

  function addAdmin(address newAdmin)
    onlyAdmin()
    returns(bool success)
  {
    admins[newAdmin] = true;
    return true;
  }

  function removeAdmin(address oldAdmin)
    onlyAdmin()
    returns(bool success)
  {
    admins[oldAdmin] = false;
    return true;
  }
}
