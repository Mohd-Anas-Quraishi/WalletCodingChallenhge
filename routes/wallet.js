'use-strict'
import models from '../utils/models.js'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, balance } = req.body;

        // Check if the amount is a valid double value
        if (isNaN(parseFloat(balance)) || !isFinite(balance)) {
            return res.status(400).json({ error: 'Invalid amount value, please pass a numeric value.' });
        }

        const transaction = await models.transaction();
        // Generate UUIDv4 ID
        const walletId = uuidv4();
        const transactionId = uuidv4();
        let requireBalance = false;
        if (name.toLowerCase() === 'savings pot' && balance < 10) {
            requireBalance = true;
        }
        else if (name !== 'savings pot' && balance <= 0) {
            return res.status(400).json({ message: 'Balance must be atleast 1 to create a wallet' });
        }

        if (requireBalance) {
            await transaction.rollback()
            return res.status(400).json({ message: 'Balance must be at least 10 for savings pot wallets' });
        } else {
            // Create wallet in database
            const wallet = await models.Wallet.create({
                wallet_id: walletId,
                name: name.toLowerCase(),
                balance: balance.toFixed(2) || 0,
            }, { transaction })
            // Create transaction in transaction collection
            const transactions = await models.Transactions.create({
                transaction_id: transactionId,
                wallet_id: wallet.wallet_id,
                amount: balance.toFixed(2),
                balance: balance.toFixed(2),
                description: 'Wallet Created',
                type: 'credit',
            }, { transaction })

            // Commit transaction if all operations are successful
            await transaction.commit();

            // Return newly created wallet and transaction
            return res.status(201).send({ wallet });
        }
    } catch (error) {
        console.error('Error creating wallet:', error);
        return res.status(500).json({ message: 'Error creating wallet' });
    }
});

router.get('/:walletId', async (req, res) => {
    try {
        const walletId = req.params.walletId
        if (!uuidValidate(walletId)) {
            return res.status(400).send({ message: 'Invalid wallet Id.' })
        }
        const wallet = await models.Wallet.findByPk(walletId);
        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found!!' });
        }
        return res.status(200).send(wallet);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
})


router.post('/:walletId/transactions', async (req, res) => {
    try {
        const { walletId } = req.params
        if (!uuidValidate(walletId)) {
            return res.status(400).send({ message: 'Invalid wallet Id.' })
        }
        let amount = req.body.amount;
        // Check if the amount is a valid double value
        if (isNaN(parseFloat(amount)) || !isFinite(amount)) {
            return res.status(400).json({ error: 'Invalid amount value, please pass a numeric value.' });
        }
        amount = amount.toFixed(2);
        const { type } = req.query;
        const wallet = await models.Wallet.findByPk(walletId);
        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found' });
        }
        let transactionId = uuidv4();
        let transaction;
        if (type.toUpperCase() === 'credit') {
            let balance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(2)
            transaction = await models.Transactions.create({
                transaction_id: transactionId,
                amount: amount,
                description: req.body.description,
                type: 'CREDIT',
                balance: balance,
                wallet_id: wallet.wallet_id,
            });

            // update the wallet balance after the transaction
            wallet.balance = balance
            await wallet.save();

        } else if (type.toUpperCase() === 'debit') {
            let balance = (parseFloat(wallet.balance) - parseFloat(amount)).toFixed(2)

            // check if the amount to be withdrawn is less than or equal to the balance in the wallet
            if (amount > wallet.balance) {
                return res.status(400).send({ message: 'Insufficient balance', availableBalance: wallet.balance });
            }

            transaction = await models.Transactions.create({
                transaction_id: transactionId,
                amount: amount,
                description: req.body.description,
                type: 'DEBIT',
                balance: balance,
                wallet_id: wallet.wallet_id,
            });

            // update the wallet balance after the transaction
            wallet.balance = balance;
            await wallet.save();

        } else {
            return res.status(400).send('Invalid transaction type');
        }

        return res.status(201).send(transaction);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});


router.get('/:walletId/transactions', (req, res) => {

    const { walletId } = req.params;
    if (!uuidValidate(walletId)) {
        return res.status(400).send({ message: 'Invalid wallet Id.' })
    }
    models.Transactions.findAll({
        attributes: ['transaction_id', 'description', 'type', 'amount', 'balance', 'createdAt', 'wallet_id'],
        where: { wallet_id: walletId },
        order: [['createdAt', 'DESC']]
    })
        .then((transactions) => {
            if (transactions.length > 0)
                return res.status(200).send(transactions);
            else
                return res.status(404).send({ message: `No wallet exist against the given wallet id ${walletId}` })
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        });
});


export default router;

