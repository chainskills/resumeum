App = {
     web3Provider: null,
     contracts: {},
     account: 0X0,


     init: function() {
          return App.initWeb3();
     },


     initWeb3: function() {
          // Initialize web3 and set the provider to the testRPC.
          if (typeof web3 !== 'undefined') {
               App.web3Provider = web3.currentProvider;
               web3 = new Web3(web3.currentProvider);
          } else {
               // set the provider you want from Web3.providers
               App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
               web3 = new Web3(App.web3Provider);
          }
          App.displayAccountInfo();
          return App.initContract();
     },


     displayAccountInfo: function() {
          web3.eth.getCoinbase(function(err, account) {
               if (err === null) {
                    App.account = account;
                    $("#account").text(account);
                    web3.eth.getBalance(account, function(err, balance) {
                         if (err === null) {
                              $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
                         }
                    });
               }
          });
     },


     initContract: function() {
          $.getJSON('Resumeum.json', function(resumeumArtifact) {
               // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
               App.contracts.Resumeum = TruffleContract(resumeumArtifact);

               // Set the provider for our contract.
               App.contracts.Resumeum.setProvider(App.web3Provider);

               // Retrieve the resume from the smart contract
               return App.reloadResumes();
          });
     },


     reloadResumes: function() {
          // refresh account information because the balance may have changed
          App.displayAccountInfo();

          App.contracts.Resumeum.deployed().then(function(instance) {
               return instance.getResume.call();
          }).then(function(resume) {
               if (resume[0] == 0x0) {
                    // no resume
                    return;
               }

               // Retrieve and clear the resume placeholder
               var resumesRow = $('#resumesRow');
               resumesRow.empty();

               // Retrieve and fill the resume template
               var resumeTemplate = $('#resumeTemplate');

               // the title will be composed by the full name following by the headline
               var title = resume[1] + " " + resume[2] + " - " + resume[3];
               resumeTemplate.find('.panel-title').text(title);

               resumeTemplate.find('.resume-summary').text(resume[4]);
               resumeTemplate.find('.resume-country').text(resume[5]);
               resumeTemplate.find('.resume-picture').attr('src', resume[6]);

               // add this new resume
               resumesRow.append(resumeTemplate.html());
          }).catch(function(err) {
               console.log(err.message);
          });
     },



     createResume: function() {
          // retrieve details of the resume
          var _firstName = $("#resume_firstName").val();
          var _lastName = $("#resume_lastName").val();
          var _headline = $("#resume_headline").val();
          var _summary = $("#resume_summary").val();
          var _country = $("#resume_country").val();
          var _urlPicture = $("#resume_profile_pic_url").val();

          if ((_firstName.trim() == '') || (_lastName.trim() == '') || (_summary.trim() == '')) {
               // nothing to publish
               return false;
          }

          App.contracts.Resumeum.deployed().then(function(instance) {
               return instance.createResume(
                    _firstName,
                    _lastName,
                    _headline,
                    _summary,
                    _country,
                    _urlPicture, {
                         from: App.account,
                         gas: 500000
                    });
          }).then(function(result) {
               App.reloadResumes();
          }).catch(function(err) {
               console.error(err);
          });
     },

     changeImage: function(event) {
          if (event.keyCode == 13) {
                  var urlImage = document.getElementById("resume_profile_pic_url");
                  $('#resume_picture').attr('src', urlImage.value);
                  return false;
              }
     },

};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
