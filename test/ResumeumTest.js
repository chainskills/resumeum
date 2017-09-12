// Contract to be tested
var Resumeum = artifacts.require("./Resumeum.sol");

// Test suite
contract('Resumeum', function(accounts) {
     var contractInstance;
     var publishPrice = 0.02;
     var newPrice = 0.04;
     var owner = accounts[0];
     var consultant1 = accounts[1];
     var consultant2 = accounts[2];
     var firstName1 = "John";
     var lastName1 = "Doe";
     var headline1 = "I’m an Ethereum developer";
     var summary1 = "In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github";
     var country1 = "Belgium";
     var urlPicture1 = "https://randomuser.me/api/portraits/men/80.jpg";
     var firstName2 = "Jane";
     var lastName2 = "Smith";
     var headline2 = "I’m an blockhain expert";
     var summary2 = "I can provide you all my expertise in the field of the blockchain.";
     var country2 = "United States";
     var urlPicture2 = "https://randomuser.me/api/portraits/women/70.jpg";


     // Test case: check initial values
     it("should be initialized with empty values", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.getNumberOfConsultants.call();
          }).then(function(data) {
               assert.equal(data, 0x0, "number of consultants must be zero");

               return contractInstance.getPrice();
          }).then(function(data) {
               assert.equal(web3.toDecimal(data), web3.toWei(publishPrice, "ether"), "publish price must be " + web3.toWei(publishPrice, "ether"));
          });
     });

     // Test case: publish a first resume
     it("should publish a first resume", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.publishResume(
                    firstName1,
                    lastName1,
                    headline1,
                    summary1,
                    country1,
                    urlPicture1, {
                         from: consultant1,
                         value: web3.toWei(publishPrice, "ether")
                    });
          }).then(function(receipt) {
               //check event
               assert.equal(receipt.logs.length, 1, "should have received one event");
               assert.equal(receipt.logs[0].event, "publishResumeEvent", "event name should be publishResumeEvent");
               assert.equal(receipt.logs[0].args._position.toNumber(), 1, "position must be 1");
               assert.equal(receipt.logs[0].args._consultant, consultant1, "consultant must be " + consultant1);
               assert.equal(receipt.logs[0].args._firstName, firstName1, "firstName name must be " + firstName1);
               assert.equal(receipt.logs[0].args._lastName, lastName1, "lastName name must be " + lastName1);
               assert.equal(receipt.logs[0].args._country, country1, "country name must be " + country1);

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
               assert.equal(data[1], firstName1, "first name must be " + firstName1);
               assert.equal(data[2], lastName1, "last name must be " + lastName1);
               assert.equal(data[3], headline1, "headline must be " + headline1);
               assert.equal(data[4], summary1, "summary must be " + summary1);
               assert.equal(data[5], country1, "country must be " + country1);
               assert.equal(data[6], urlPicture1, "URL profile picture must be " + urlPicture1);

               // check the balance of the contract after the publication
               contractBalance = web3.fromWei(web3.eth.getBalance(Resumeum.address), "ether").toNumber();
               assert(contractBalance == publishPrice, "contract should have earned " + publishPrice + " ETH");
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

     // Test case: publish a second resume
     it("should publish a second resume", function() {
          return Resumeum.deployed().then(function(instance) {
               contractInstance = instance;
               return contractInstance.publishResume(
                    firstName2,
                    lastName2,
                    headline2,
                    summary2,
                    country2,
                    urlPicture2, {
                         from: consultant2,
                         value: web3.toWei(newPrice, "ether")
                    });
          }).then(function(receipt) {
               //check event
               assert.equal(receipt.logs.length, 1, "should have received one event");
               assert.equal(receipt.logs[0].event, "publishResumeEvent", "event name should be publishResumeEvent");
               assert.equal(receipt.logs[0].args._position.toNumber(), 2, "position must be 2");
               assert.equal(receipt.logs[0].args._consultant, consultant2, "consultant must be " + consultant2);
               assert.equal(receipt.logs[0].args._firstName, firstName2, "firstName name must be " + firstName2);
               assert.equal(receipt.logs[0].args._lastName, lastName2, "lastName name must be " + lastName2);
               assert.equal(receipt.logs[0].args._country, country2, "country name must be " + country2);

               return contractInstance.getNumberOfConsultants();
          }).then(function(data) {
               assert.equal(data, 2, "number of consultants must be two");

               return contractInstance.getConsultants();
          }).then(function(data) {
               assert.equal(data.length, 2, "there must now be 2 consultants");
               consultantAddress = data[1];
               assert.equal(consultantAddress, consultant2, "consultant must be " + consultant2);

               return contractInstance.resumes(consultantAddress);
          }).then(function(data) {
               assert.equal(data[0], consultant2, "consultant must be " + consultant2);
               assert.equal(data[1], firstName2, "first name must be " + firstName2);
               assert.equal(data[2], lastName2, "last name must be " + lastName2);
               assert.equal(data[3], headline2, "headline must be " + headline2);
               assert.equal(data[4], summary2, "summary must be " + summary2);
               assert.equal(data[5], country2, "country must be " + country2);
               assert.equal(data[6], urlPicture2, "URL profile picture must be " + urlPicture2);

               // check the balance of the contract after the publication
               contractBalance = web3.fromWei(web3.eth.getBalance(Resumeum.address), "ether").toNumber();
               assert(contractBalance == (publishPrice + newPrice), "contract should have earned " + (publishPrice + newPrice) + " ETH");
          });
     });
});
