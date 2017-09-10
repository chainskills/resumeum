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




     // constructor -> create a default resume
     function Resumeum() {
         createResume(
              "Said",
              "Eloudrhiri",
              "Blockchain enthusiast",
              "Hi, I’m Said. As a speaker, I have the pleasure to share my return of experiences about mobile development, agile development or the blockchain.",
              "Belgium",
              "https://goo.gl/5XzfDH");
     }
     

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
