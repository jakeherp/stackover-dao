import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

const tokenModule = sdk.getTokenModule(
	'0x7eFd41324f4a3666E659c42190DA0C0F6820BC91'
);

const printMoney = async () => {
	try {
		const amount = 5_000_000;
		// We use the util function from "ethers" to convert the amount
		// to have 18 decimals (which is the standard for ERC20 tokens).
		const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
		// Interact with your deployed ERC-20 contract and mint the tokens!
		await tokenModule.mint(amountWith18Decimals);
		const totalSupply = await tokenModule.totalSupply();

		// Print out how many of our token's are out there now!
		console.log(
			'✅ There now is',
			ethers.utils.formatUnits(totalSupply, 18),
			'$STACK in circulation'
		);
	} catch (error) {
		console.error('Failed to print money', error);
	}
};

printMoney();
