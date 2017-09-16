pragma solidity ^0.4.15;

import "./Ownable.sol";

contract Resumeum is Ownable {
     // Custom types
     struct Resume {
          address consultant;
          string firstName;
          string lastName;
          string headline;
          string summary;
          string country;
          string urlPicture;
     }

     // State variables
     uint256 publishPrice;
     mapping (address => Resume) public resumes;
     mapping (uint => address) public consultants;
     uint consultantCounter;

     // Events
     event publishResumeEvent(
          uint indexed _position,
          address indexed _consultant,
          string _firstName,
          string _lastName,
          string _country);


     // constructor
     function Resumeum(uint256 _publishPrice) {
          publishPrice = _publishPrice;
     }

     // kill the smart contract
     function kill() onlyOwner() {
          selfdestruct(owner);
     }

     // change the publication price (only for owner)
     function setPrice(uint256 _publishPrice) {
          require(msg.sender == owner);

          publishPrice = _publishPrice;
     }

     // get the publication price
     function getPrice() constant returns(uint256 price) {
          return publishPrice;
     }

     // publish a resume
     function publishResume(
          string _firstName,
          string _lastName,
          string _headline,
          string _summary,
          string _country,
          string _urlPicture) payable public {

          // a first name and a last name are required
          require(bytes(_firstName).length > 0);
          require(bytes(_lastName).length > 0);

          // one publication per consultant
          Resume memory resume = resumes[msg.sender];
          require(resume.consultant == 0x0);

          // we check whether the value sent corresponds to the service price
          require(msg.value == publishPrice);

          // a new consultant
          consultantCounter++;

          // store the consultant
          consultants[consultantCounter] = msg.sender;

          // store this resume
          resumes[msg.sender] = Resume(
               msg.sender,
               _firstName,
               _lastName,
               _headline,
               _summary,
               _country,
               _urlPicture
          );

          // trigger the event
          publishResumeEvent(consultantCounter, msg.sender, _firstName, _lastName, _country);
     }

     // fetch the number of consultants in the contract
     function getNumberOfConsultants() public constant returns (uint) {
          return consultantCounter;
     }

     // fetch all consultants
     function getConsultants() public constant returns (address[]) {

          address[] memory consultantsList = new address[](consultantCounter);
          for (uint i = 0; i < consultantCounter; i++) {
               consultantsList[i] = consultants[i + 1];
          }

          return consultantsList;
     }
}
