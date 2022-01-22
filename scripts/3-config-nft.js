import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const bundleDrop = sdk.getBundleDropModule(
	process.env.BUNDLE_DROP_MODULE_ADDRESS
);

const configureNft = async () => {
	try {
		await bundleDrop.createBatch([
			{
				name: 'Coder',
				description: 'This NFT will give you access to StackoverDAO',
				image: readFileSync('scripts/assets/coder.png'),
			},
		]);
		console.log('✅ Successfully created a new NFT in the drop!');
	} catch (error) {
		console.error('failed to create the new NFT', error);
	}
};

configureNft();
