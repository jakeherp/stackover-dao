import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

import dotenv from 'dotenv';
dotenv.config();

const voteModule = sdk.getVoteModule(process.env.VOTE_MODULE_ADDRESS);
const tokenModule = sdk.getTokenModule(process.env.TOKEN_MODULE_ADDRESS);

console.log(`voteModule.address`, voteModule.address);
console.log(`tokenModule.address`, tokenModule.address);

const createVoteProposals = async () => {
	try {
		await tokenModule.delegateTo(process.env.WALLET_ADDRESS);

		const amount = 420_000;

		await voteModule.propose(
			`Should the DAO mint an additional ${amount} tokens into the treasury?`,
			[
				{
					// Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
					// to send in this proposal. In this case, we're sending 0 ETH.
					// We're just minting new tokens to the treasury. So, set to 0.
					nativeTokenValue: 0,
					transactionData: tokenModule.contract.interface.encodeFunctionData(
						'mint',
						[voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)]
					),
					// Our token module that actually executes the mint.
					toAddress: tokenModule.address,
				},
			]
		);

		console.log('✅ Successfully created proposal to mint tokens');
	} catch (error) {
		console.error('failed to create first proposal', error);
		process.exit(1);
	}

	try {
		await tokenModule.delegateTo(process.env.WALLET_ADDRESS);

		const amount = 6_900;
		await voteModule.propose(
			'Should the DAO transfer ' +
				amount +
				' tokens from the treasury to ' +
				process.env.WALLET_ADDRESS +
				' for being awesome?',
			[
				{
					nativeTokenValue: 0,
					transactionData: tokenModule.contract.interface.encodeFunctionData(
						'transfer',
						[
							process.env.WALLET_ADDRESS,
							ethers.utils.parseUnits(amount.toString(), 18),
						]
					),

					toAddress: tokenModule.address,
				},
			]
		);

		console.log(
			"✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
		);
	} catch (error) {
		console.error('failed to create second proposal', error);
	}
};

createVoteProposals();
