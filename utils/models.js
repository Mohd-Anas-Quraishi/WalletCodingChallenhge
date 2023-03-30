import Sequelize, { STRING, DECIMAL } from 'sequelize';
import config from '../config/config.js';

// Create a Sequelize instance
const sequelize = new Sequelize(config.dbName, config.dbUsername, config.dbPassword, {
  host: config.dbHost,
  dialect: 'mysql',
});
// Define the User model
const Wallet = sequelize.define('wallet', {
  wallet_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  balance: {
    type: Sequelize.DECIMAL(20, 2),
    allowNull: false
  }
});

const Transactions = sequelize.define('transactions', {
  transaction_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM('credit', 'debit'),
    allowNull: false,
  },
  amount: {
    type: DECIMAL(20, 2),
    allowNull: false
  },
  balance: {
    type: DECIMAL(20, 2),
    allowNull: false
  }
});
Wallet.hasMany(Transactions);
Transactions.belongsTo(Wallet, { foreignKey: 'wallet_id' });

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('Database models synchronized successfully!');
  })
  .catch((error) => {
    console.error('Error synchronizing database models:', error);
  });

// Export the models
export default {
  Wallet,
  Transactions,
  transaction: sequelize.transaction.bind(sequelize)
};
