import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const app = sdk.getAppModule('0xBaD0920F30DA5030f001bAF6F900118E63e54204');

(async () => {
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
})();
