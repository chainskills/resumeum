App = {
     web3Provider: null,
     contracts: {},


     init: function() {
          // Load resume
          var resumesRow = $('#resumesRow');
          var resumeTemplate = $('#resumeTemplate');

          resumeTemplate.find('.panel-title').text("John Doe");
          resumeTemplate.find('.resume-headline').text("I’m an Ethereum developer");
          resumeTemplate.find('.resume-summary').text("In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github");
          resumeTemplate.find('.resume-country').text(" Belgium");

          resumesRow.append(resumeTemplate.html());

          $('#account').text("0x1daa654CfBc28F375E0f08F329dE219Fff50C765");
          $('#accountBalance').text("10 ETH");

          return App.initWeb3();
     },

     initWeb3: function() {
          /*
           * Replace me...
           */

          return App.initContract();
     },

     initContract: function() {
          /*
           * Replace me...
           */

          return App.bindEvents();
     },

     bindEvents: function() {
          $(document).on('click', '.btn-adopt', App.handleAdopt);
     },

     handleAdopt: function() {
          event.preventDefault();

          var petId = parseInt($(event.target).data('id'));

          /*
           * Replace me...
           */
     },

     markAdopted: function(adopters, account) {
          /*
           * Replace me...
           */
     }

};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
