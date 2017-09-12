App = {
          web3Provider: null,
          contracts: {},
          account: 0X0,
          servicePrice: 0,
          loading: false,


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

               // display the price of the servive when the modal is displayed
               $('#publishResume').on('shown.bs.modal', function(e) {
                    App.displayPrice();
               })

               App.displayAccountInfo();
               return App.initContract();
          },


          displayPrice: function() {
               App.contracts.Resumeum.deployed().then(function(instance) {
                    return instance.getPrice.call();
               }).then(function(price) {
                    servicePrice = price;
                    $('#servicePrice').text("This service costs: " + web3.fromWei(servicePrice, "ether") + " ETH");
               }).catch(function(err) {
                    console.log(err.message);
               });
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

                    // Listen for events
                    App.listenToEvents();

                    // Retrieve the resume from the smart contract
                    return App.reloadResumes();
               });
          },

          reloadResumes: function() {
               // avoid reentry
               if (App.loading) {
                    return;
               }
               App.loading = true;

               // refresh account information because the balance may have changed
               App.displayAccountInfo();

               var contractInstance;

               App.contracts.Resumeum.deployed().then(function(instance) {
                    contractInstance = instance;
                    return contractInstance.getConsultants.call();
               }).then(function(consultants) {
               // Retrieve and clear the resume placeholder
               var resumesRow = $('#resumesRow');
               resumesRow.empty();

               for (var i = 0; i < consultants.length; i++) {
                    var consultant = consultants[i];
                    contractInstance.resumes.call(consultant).then(function(resume) {
                         App.displayResume(
                              resume[0],
                              resume[1],
                              resume[2],
                              resume[3],
                              resume[4],
                              resume[5],
                              resume[6]
                         );
                    });
               }
               App.loading = false;
          }).catch(function(err) {
               console.log(err.message);
               App.loading = false;
          });
     },


     displayResume: function(
          consultant,
          firstName,
          lastName,
          headline,
          summary,
          country,
          urlPicture) {

          // Retrieve and clear the resume placeholder
          var resumesRow = $('#resumesRow');

          // Retrieve and fill the resume template
          var resumeTemplate = $('#resumeTemplate');

          // the title will be composed by the full name following by the headline
          var title = firstName + " " + lastName + " - " + headline;
          resumeTemplate.find('.panel-title').text(title);

          resumeTemplate.find('.resume-summary').text(summary);
          resumeTemplate.find('.resume-country').text(country);
          resumeTemplate.find('.resume-picture').attr('src', urlPicture);

          // add this new resume
          resumesRow.append(resumeTemplate.html());

          // hide the Publish button if we already have a resume
          if (consultant == App.account) {
               document.getElementById('publishResumeButton').style.display = 'none';
          } else {
               document.getElementById('publishResumeButton').style.display = 'block';
          }
     },


     publishResume: function() {
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
               return instance.publishResume(
                    _firstName,
                    _lastName,
                    _headline,
                    _summary,
                    _country,
                    _urlPicture, {
                         from: App.account,
                         value: servicePrice,
                         gas: 500000
                    });
          }).then(function(result) {}).catch(function(err) {
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

     // Listen to events raised from the contract
     listenToEvents: function() {
          App.contracts.Resumeum.deployed().then(function(instance) {
               instance.publishResumeEvent({}, {
                    fromBlock: 0,
                    toBlock: 'latest'
               }).watch(function(error, event) {
                    $("#events").append(
                         '<li class="list-group-item">New resume from ' +
                         event.args._firstName + ' ' +
                         event.args._lastName +
                         ' [' + event.args._consultant + '] from ' +
                         event.args._country + '</li>');
                    App.reloadResumes();
               });
          });
     },

};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
