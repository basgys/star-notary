# Star Notary

## ⚠️ Note ⚠️
Unfortunately I was not able to get ETH on the Rinkeby network from any faucets. https://www.rinkeby.io/#faucet requires to have a social network account, which I don't have. And metamask faucet does not send coins on Rinkeby for some reasons.

Therefore I had to deploy on Ropsten instead of Rinkeby.

## Instructions

### Specify the Truffle version and OpenZeppelin version used in the project.
^3.2.0

### Your ERC-721 Token Name
StarNotary

### Your ERC-721 Token Symbol
SNY

### Your “Token Address” on the ~~Rinkeby~~ Ropsten Network
My account 0x35F659Ec81bb9A38ae576140107a6c5C8AE55900

I created three stars (1, 2, and 3). Star 3 is on sale.

## Dependencies

1. Ganache GUI (development environment)

## Setup

```shell
# Start ganache GUI

# Initialise truffle project and deploy contracts on development env
$ yarn && truffle migrate --reset

# Initialise web app and start development server
$ cd app && yarn && yarn link-contracts && yarn dev

# Open app
$ open http://localhost:3000
```

## Evaluation

Star on `/app/pages/index.tsx`

Some parts of the app are still unfinished and I would have to spend more time
on the async part. Ropsten and the main net are quite slow and the app feels
unresponsive at the moment.

Also, the error handling is rather poor (connection, contract failures, ...)

But you can already:

1. See your stars
2. See stars on sale
3. Search for a star
4. Sell a star
5. Buy a star
6. Initiate a star transfer (but not complete from the app it unfortunately)