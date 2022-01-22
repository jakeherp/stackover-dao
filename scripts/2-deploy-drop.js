import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const app = sdk.getAppModule(process.env.APP_MODULE_ADDRESS);

const deployDrop = async () => {
	try {
		const bundleDropModule = await app.deployBundleDropModule({
			name: 'StackoverDAO Membership',
			description:
				'A DAO for software engineering related questions (similar to stack overflow) where good answers are rewarded with $STACK.',
			image: readFileSync('scripts/assets/StackoverDAO.png'),
			// Set to own address to charge for NFT drop
			primarySaleRecipientAddress: ethers.constants.AddressZero,
		});

		console.log(
			'✅ Successfully deployed bundleDrop module, address:',
			bundleDropModule.address
		);
		console.log(
			'✅ bundleDrop metadata:',
			await bundleDropModule.getMetadata()
		);
	} catch (error) {
		console.error('failed to deploy bundleDrop module', error);
	}
};

deployDrop();
