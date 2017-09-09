// Contract to be tested
var Resumeum = artifacts.require("./Resumeum.sol");

// Test suite
contract('Resumeum', function(accounts) {

     var contractInstance;
     var consultant = accounts[1];
     var firstName = "John";
     var lastName = "Doe";
     var headline = "I’m an Ethereum developer";
     var summary = "In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github";
     var country = "Belgium";


     // Test case: check initial values
     it("should be initialized with empty values", function() {
          return Resumeum.deployed().then(function(instance) {
               return instance.getResume.call();
          }).then(function(data) {
               assert.equal(data[0], 0x0, "consultant must be empty");
               assert.equal(data[1], '', "first name must be empty");
               assert.equal(data[2], '', "last name must be empty");
               assert.equal(data[3], '', "headline must be empty");
               assert.equal(data[4], '', "summary must be empty");
               assert.equal(data[5], '', "country must be empty");
          });
     });

     // Test case: create a resume
     it("should create a resume", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.createResume(
                    firstName,
                    lastName,
                    headline,
                    summary,
                    country, {
                    from: consultant
               });
          }).then(function() {
               return contractInstance.getResume.call();
          }).then(function(data) {
               assert.equal(data[0], consultant, "consultant must be " + consultant);
               assert.equal(data[1], firstName, "first name must be " + firstName);
               assert.equal(data[2], lastName, "last name must be " + lastName);
               assert.equal(data[3], headline, "headline must be " + headline);
               assert.equal(data[4], summary, "summary must be " + summary);
               assert.equal(data[5], country, "country must be " + country);
          });
     });
});
