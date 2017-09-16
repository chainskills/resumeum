pragma solidity ^0.4.15;

contract Ownable {
     // State variable
     address owner;

     // Modifiers
     modifier onlyOwner() {
          require(msg.sender == owner);
          _;
     }

     // constructor
     function Ownable() {
          owner = msg.sender;
     }
}
