# Resumeum - Publish your resume on Ethereum
Sample Ethereum Dapp to create your resume on Ethereum.

Follow the steps described below to install, deploy and run the Dapp.

## Warning
**Make that you don't run your tests on the Ethereum's main net otherwise you will spend real ether with no chance to get it back**

## Prerequisites: Install tools and frameworks

To build, deploy and test your Dapp locally, you need to install the following tools and frameworks:
* **node.js and npm**: https://nodejs.org/en/
  * Node.js can be installed from an installation package or through some package managers such as Homebrew on a Mac.

* **Truffle**: https://github.com/trufflesuite/truffle
  * Create and deploy your Dapp with this build framework for Ethereum.

* **testrpc**: https://github.com/ethereumjs/testrpc
  * Simulates an Ethereum node.

* **Metamask**: https://metamask.io/
  * Transforms Chrome into a Dapp browser

## Step 1. Clone the project

`git clone https://github.com/chainskills/resumeum`

## Step 2. Install all dependencies

```
$ cd resumeum
$ npm install
```

## Step 3. Start your Ethereum node

Start testrpc or your private chain. We added a script at the root of the project that starts a testrpc instance with 3 predefined accounts.

```
$ ./starttestrpc.sh
```

The first account will be the **coinbase**, the account that will deploy the contracts.

## Step 4. Configure your project

If you didn't use the `starttestrpc.sh` script and started your own private chain instead, you should edit the `truffle.js` file and set the port number according to your Ethereum node.

## Step 5. Test your project

```
$ truffle test
```

## Step 6. Compile and deploy your smart contract

```
$ truffle migrate --reset
```

You will have to migrate (deploy) your smart contract each time your restart **testrpc**.

## Step 7. Metamask: connect to your local Ethereum node

Unlock the Metamask extension in Chrome, and switch it to the network "Localhost 8545".

## Step 8. Metamask: import your accounts

Import accounts defined in your testrpc Ethereum node.

If you used `starttestrpc.sh`, here are the 3 private keys defined in the script:
* 0x351494a5ae8f9b70a2a2fd482146ab4578f61d4d796685c597ec6683635a940e
* 0x4cd491f96e6623edb52719a8d4d1110a87d8d83e3fa86f8e14007cb3831c0a2b
* 0xef40e0d6ada046010b6965d73603cabae1a119ca804f5d9e9a9ce866b0bea7d

In Metamask, rename these accounts respectively:
* testrpc-coinbase
* testrpc-account1
* testrpc-account2

## Step 9. Run your frontend application

```
$ npm run dev
```

In your browser, open the following URL: http://localhost:3000

## Step 10. Metamask: switch to the `testrpc-account1` account

When you switch accounts or networks in Metamask, you have to refresh your  page to let your frontend application know about it.

## Step 11. Publish resumes

You can publish your resume.

Metamask will ask you to confirm the transaction before publishing your resume.

## Step 12. Interact with the smart contract:

From your console window in Terminal, you can use the Truffle console to inspect the status of your contract.

Here is a short example:

### Open the console:
```
$ truffle console
truffle(development)>
```

### Get an instance of the smart contract:
```
truffle(development)> Resumeum.deployed().then(function(instance) {app = instance; })
```
From now on, you can use the `app` variable to interact with your smart contract.

### List your accounts:
```
truffle(development)> web3.eth.accounts
[ '0x00d1ae0a6fc13b9ecdefa118b94cf95ac16d4ab0',   '0x1daa654cfbc28f375e0f08f329de219fff50c765',   '0xc2dbc0a6b68d6148d80273ce4d6667477dbf2aa7' ]
```

### Get the price of the service:
```
truffle(development)> app.getPrice.call()
{ [String: '40000000000000000'] s: 1, e: 16, c: [ 400 ] }
```

### Change the price of the service (as the contract's owner):
```
truffle(development)> app.setPrice(40000000000000000, {from: web3.eth.accounts[0]})
```

### Get the balance of your smart contract:
```
truffle(development)> web3.fromWei(web3.eth.getBalance(Resumeum.address), "ether").toNumber()
```

### Get the balance of the account 1:
```
truffle(development)> web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether").toNumber()
```

### Watch for events:
```
truffle(development)> var resumeEvent = app.publishResumeEvent({}, {fromBlock: 0,toBlock: 'latest'}).watch(function(error, event) {console.log(event);})
```

### Get the list of resumes:
```
truffle(development)> app.getResume.call()
[ '0x1daa654cfbc28f375e0f08f329de219fff50c765',   'John',   'Doe',   'I’m an Ethereum developer',   'In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github',   'Belgium',   'https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png' ]
```

#
### Publish resumes (as accounts 1 and 2):
```
truffle(development)> app.publishResume("John", "Doe", "I’m an Ethereum developer", "In the past year, I have created a lot of Ethereum smart contracts. My personal projects are available on Github", "Belgium", "https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_960_720.png", {from: web3.eth.accounts[1], value: web3.toWei(0.02, "ether")} )

truffle(development)> app.publishResume("Jane", "Smith", "I'm an blockchain developer", "This is my summary", "United States", "http://i.pravatar.cc/300", {from: web3.eth.accounts[2], value: web3.toWei(0.02, "ether")})
```

### Get the addresses of the consultants that have published a resume:
```
truffle(development)> app.getConsultants()
[ '0x1daa654cfbc28f375e0f08f329de219fff50c765',   '0xc2dbc0a6b68d6148d80273ce4d6667477dbf2aa7' ]
```

### Get the detail of a resume owned by a consultant:
```
truffle(development)> app.resumes('0x1daa654cfbc28f375e0f08f329de219fff50c765') [ '0x1daa654cfbc28f375e0f08f329de219fff50c765',   'John',   'Doe',   'I\'m a developer',   'This is my summary',   'Belgium',   'http://i.pravatar.cc/300' ]
```

### Deactivate you smart contract:
Only required if you want to "kill" your smart contract:
```
truffle(development)> app.kill({from: web3.eth.accounts[0]})
```

## Tips

* Is Metamask slow ? try to disable and enable the extension. This happens sometimes, especially when we work with a private chain.
* When you switch accounts in Metamask, don't forget to refresh the page to make sure you get the current account set in Metamask.

## Learn more

If you want to know more about all the steps required to install, build and  deploy a Dapp, you can subscribe to our course available on Udemy: https://www.udemy.com/getting-started-with-ethereum-solidity-development

Have fun !!!

ChainSkills Team - 2017
