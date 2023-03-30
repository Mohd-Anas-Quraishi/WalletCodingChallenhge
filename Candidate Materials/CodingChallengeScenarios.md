# Scenarios

## Creating wallets
As a product owner, I want a customer to be able to create a wallet

OpenAPI operationId: createNewWallet

Acceptance Criteria

When a wtallet is creaed with a name of `Savings Pot`
And an opening balance of `10.00`
Then the wallet is created

When a wallet is created with a name of `Savings Pot`
And a opening balance is not specified
Then an error is returned

When a customer tries to create a wallet with a name of `Savings Pot`
And a negative opening balance
Then an error is returned

You should also consider other errors cases and optionally implement them.


## Fetching wallets
As a product owner, I want a customer to be able to fetch their wallet to view their balance

OpenAPI operationId: fetchWalletById

Acceptance Criteria

Given a wallet exists
When the customer fetches a wallet using a valid wallet ID
Then the wallet is returned

Given a wallet not exists
When the customer fetches a wallet using an invalid wallet ID
Then an error is returned

Again, you should also consider other errors cases and optionally implement them.


## Depositing and withdrawing
As a product owner, I want a customer to be able to deposit or withdraw money from a wallet

OpenAPI operationId: createTransaction

Acceptance Criteria

Given a wallet exists
When the customer creates a transaction to deposit 10.00 using a valid wallet ID
Then the transaction is recorded
And 10.00 is added to the previous balance

Given a wallet exists with a balance of 50.00
When the customer creates a transaction to withdraw 49.99 for that wallet
Then the transaction is recorded
And 49.99 is subtracted from the previous balance

Given a wallet exists with a balance of 50.00
When the customer creates a transaction to withdraw 50.01 for that wallet
Then an error is returned

Again, you should also consider other errors cases and optionally implement them.


## Transactions
As a product owner, I want a customer to be able to view all the transactions for a wallet

OpenAPI operationId: fetchTransactionsForWallet

Acceptance Criteria

Given a wallet exists
When a customer fetches transactions using a valid wallet ID
Then a list of transactions is returned

When a customer fetches transactions using an invalid wallet ID
Then an error is returned