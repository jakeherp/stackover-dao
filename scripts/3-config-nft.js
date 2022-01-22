import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule(
	'0x405EA27acE7e537a42Bcac5a38b4A27ED388B45D'
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
