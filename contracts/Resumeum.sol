pragma solidity ^0.4.15;

contract Resumeum {
     // State variables
     address consultant;
     string firstName;
     string lastName;
     string headline;
     string summary;
     string country;

     // add a resume
     function addResume(
          string _firstName,
          string _lastName,
          string _headline,
          string _summary,
          string _country) public {

          consultant = msg.sender;
          firstName = _firstName;
          lastName = _lastName;
          headline = _headline;
          summary = _summary;
          country = _country;
     }

     // get the resume
     function getResume() public constant returns (
          address _consultant,
          string _firstName,
          string _lastName,
          string _headline,
          string _summary,
          string _country) {

          return(consultant, firstName, lastName, headline, summary, country);
     }
}
