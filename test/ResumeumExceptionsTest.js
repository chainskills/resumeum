// Contract to be tested
var Resumeum = artifacts.require("./Resumeum.sol");

// Test suite
contract('Resumeum', function(accounts) {
     var contractInstance;
     var publishPrice = 0.02;
     var newPrice = 0.04;
     var consultant1 = accounts[1];
     var consultant2 = accounts[2];
     var firstName = "John";
     var lastName = "Doe";
     var headline = "I’m an Ethereum developer";
     var anotherHeadline = "I’m an Ethereum developer and a speaker";
     var summary = "In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github";
     var country = "Belgium";
     var anotherCountry = "France";
     var urlPicture = "https://goo.gl/5XzfDH";


     // Test case: publish a resume with an empty full name
     it("should throw an exception if you try to publish a resume with no first name or last name", function() {
          return Resumeum.deployed().then(function(instance) {
                    contractInstance = instance;
                    return contractInstance.publishResume(
                         '',
                         '',
                         headline,
                         summary,
                         country,
                         urlPicture, {
                              from: consultant1,
                              value: web3.toWei(publishPrice, "ether")
                         });
               }).then(assert.fail)
               .catch(function(error) {
                    assert(error.message.indexOf('invalid opcode') >= 0, "error should be invalid opcode");
               }).then(function() {
                    return contractInstance.getNumberOfConsultants();
               }).then(function(data) {
                    assert.equal(data, 0, "number of consultants must be zero");
               });
     });


     // Test case: publish a empty resume
     it("should throw an exception if you try to publish a resume twice", function() {
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
                    return contractInstance.publishResume(
                         firstName,
                         lastName,
                         anotherHeadline,
                         summary,
                         anotherCountry,
                         urlPicture, {
                              from: consultant1,
                              value: web3.toWei(publishPrice, "ether")
                         });
               }).then(assert.fail)
               .catch(function(error) {
                    assert(error.message.indexOf('invalid opcode') >= 0, "error should be invalid opcode");
               }).then(function() {
                    return contractInstance.getNumberOfConsultants();
               }).then(function(data) {
                    assert.equal(data, 1, "number of consultants must be one");

                    return contractInstance.getConsultants();
               }).then(function(data) {
                    assert.equal(data.length, 1, "there must now be 1 consultant");
                    consultantAddress = data[0];
                    assert.equal(consultantAddress, consultant1, "consultant must be " + consultant1);

                    return contractInstance.resumes(consultantAddress);
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


     // Test case: paying the wrong price
     it("should throw an exception if you try to pay the wrong price", function() {
          return Resumeum.deployed().then(function(instance) {
                    contractInstance = instance;
                    return contractInstance.publishResume(
                         firstName,
                         lastName,
                         headline,
                         summary,
                         country,
                         urlPicture, {
                              from: consultant2,
                              value: web3.toWei(publishPrice + 1, "ether")
                         });
               }).then(assert.fail)
               .catch(function(error) {
                    assert(error.message.indexOf('invalid opcode') >= 0, "error should be invalid opcode");
               }).then(function() {
                    return contractInstance.getNumberOfConsultants();
               }).then(function(data) {
                    assert.equal(data, 1, "number of consultants must be one");

                    return contractInstance.getConsultants();
               }).then(function(data) {
                    assert.equal(data.length, 1, "there must now be 1 consultant");
                    consultantAddress = data[0];
                    assert.equal(consultantAddress, consultant1, "consultant must be " + consultant1);

                    return contractInstance.resumes(consultantAddress);
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

     // Test case: change the price by an unauthorized account
     it("should throw an exception if you try to change the price while you are not the contract's owner", function() {
          return Resumeum.deployed().then(function(instance) {
                    contractInstance = instance;
                    return contractInstance.setPrice(
                         web3.toWei(newPrice, "ether"), {
                              from: consultant1
                         });
               }).then(assert.fail)
               .catch(function(error) {
                    assert(error.message.indexOf('invalid opcode') >= 0, "error should be invalid opcode");
               }).then(function() {
                    return contractInstance.getPrice.call();
               }).then(function(data) {
                    assert.equal(web3.toDecimal(data), web3.toWei(publishPrice, "ether"), "publish price must be " + web3.toWei(publishPrice, "ether"));
               });
     });
});
