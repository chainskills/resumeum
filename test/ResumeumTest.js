// Contract to be tested
var Resumeum = artifacts.require("./Resumeum.sol");

// Test suite
contract('Resumeum', function(accounts) {
     var contractInstance;
     var publishPrice = 0.02;
     var newPrice = 0.04;     var owner = accounts[0];
     var consultant1 = accounts[1];
     var consultant2 = accounts[2];
     var firstName = "John";
     var lastName = "Doe";
     var headline = "I’m an Ethereum developer";
     var summary = "In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github";
     var country = "Belgium";
     var urlPicture = "https://goo.gl/5XzfDH";


     // Test case: check initial values
     it("should be initialized with empty values", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.getResume.call();
          }).then(function(data) {
               assert.equal(data[0], 0x0, "consultant must be empty");
               assert.equal(data[1], '', "first name must be empty");
               assert.equal(data[2], '', "last name must be empty");
               assert.equal(data[3], '', "headline must be empty");
               assert.equal(data[4], '', "summary must be empty");
               assert.equal(data[5], '', "country must be empty");
               assert.equal(data[6], '', "URL profile picture must be empty");

               return contractInstance.getPrice.call();
          }).then(function(data) {
               assert.equal(web3.toDecimal(data), web3.toWei(publishPrice, "ether"), "publish price must be " + web3.toWei(publishPrice, "ether"));
          });
     });

     // Test case: publish a resume
     it("should publish a resume", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.publishResume(
                    firstName,
                    lastName,
                    headline,
                    summary,
                    country,
                    urlPicture, {
                         from: consultant1,
                         value: web3.toWei(publishPrice, "ether")
                    });
          }).then(function() {
               return contractInstance.getResume.call();
          }).then(function(data) {
               assert.equal(data[0], consultant1, "consultant must be " + consultant1);
               assert.equal(data[1], firstName, "first name must be " + firstName);
               assert.equal(data[2], lastName, "last name must be " + lastName);
               assert.equal(data[3], headline, "headline must be " + headline);
               assert.equal(data[4], summary, "summary must be " + summary);
               assert.equal(data[5], country, "country must be " + country);
               assert.equal(data[6], urlPicture, "URL profile picture must be " + urlPicture);
          });
     });

     // Test case: should check events
     it("should trigger an event when a new resume is published", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               watcher = contractInstance.publishResumeEvent();
               return contractInstance.publishResume(
                    firstName,
                    lastName,
                    headline,
                    summary,
                    country,
                    urlPicture, {
                         from: consultant2,
                         value: web3.toWei(publishPrice, "ether")
                    });
          }).then(function() {
               return watcher.get();
          }).then(function(events) {
               assert.equal(events.length, 1, "should have received one event");
               assert.equal(events[0].args._consultant, consultant2, "consultant must be " + consultant2);
               assert.equal(events[0].args._firstName, firstName, "firstName name must be " + firstName);
               assert.equal(events[0].args._lastName, lastName, "lastName name must be " + lastName);
               assert.equal(events[0].args._country, country, "country name must be " + country);
          });
     });

     // Test case: check change of price
     it("should change the price by the owner", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.setPrice(
                    web3.toWei(newPrice, "ether"), {
                         from: owner
                    });
          }).then(function() {
               return contractInstance.getPrice.call();
          }).then(function(data) {
               assert.equal(web3.toDecimal(data), web3.toWei(newPrice, "ether"), "publish price must be " + web3.toWei(newPrice, "ether"));
          });
     });
});
