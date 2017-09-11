pragma solidity ^0.4.15;

contract Resumeum {
     // State variables
     address owner;
     uint256 publishPrice;
     address consultant;
     string firstName;
     string lastName;
     string headline;
     string summary;
     string country;
     string urlPicture;



     // Events
     event publishResumeEvent(
          address indexed _consultant,
          string _firstName,
          string _lastName,
          string _country);


     // constructor
     function Resumeum(uint256 _publishPrice) {
          owner = msg.sender;
          publishPrice = _publishPrice;
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
          require(consultant != msg.sender);

          // we check whether the value sent corresponds to the service price
          require(msg.value == publishPrice);

          // store the values
          consultant = msg.sender;
          firstName = _firstName;
          lastName = _lastName;
          headline = _headline;
          summary = _summary;
          country = _country;
          urlPicture = _urlPicture;

          // trigger the event
          publishResumeEvent(consultant, firstName, lastName, country);
     }

     // get the resume
     function getResume() public constant returns (
          address _consultant,
          string _firstName,
          string _lastName,
          string _headline,
          string _summary,
          string _country,
          string _urlPicture) {

          return(consultant, firstName, lastName, headline, summary, country, urlPicture);
     }
}
