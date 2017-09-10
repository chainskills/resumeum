pragma solidity ^0.4.15;

contract Resumeum {
     // State variables
     address consultant;
     string firstName;
     string lastName;
     string headline;
     string summary;
     string country;
     string urlPicture;

     // Events
     event createResumeEvent(
          address indexed _consultant,
          string _firstName,
          string _lastName,
          string _country);

     // create a resume
     function createResume(
          string _firstName,
          string _lastName,
          string _headline,
          string _summary,
          string _country,
          string _urlPicture) public {

          consultant = msg.sender;
          firstName = _firstName;
          lastName = _lastName;
          headline = _headline;
          summary = _summary;
          country = _country;
          urlPicture = _urlPicture;

          createResumeEvent(consultant, firstName, lastName, country);
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
