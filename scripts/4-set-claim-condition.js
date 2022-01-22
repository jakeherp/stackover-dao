import sdk from './1-initialize-sdk.js';

import dotenv from 'dotenv';
dotenv.config();

const bundleDrop = sdk.getBundleDropModule(
	process.env.BUNDLE_DROP_MODULE_ADDRESS
);

const setClaimCondition = async () => {
	try {
		const claimConditionFactory = bundleDrop.getClaimConditionFactory();
		// Specify conditions.
		claimConditionFactory.newClaimPhase({
			startTime: new Date(),
			maxQuantity: 5_000_000,
			maxQuantityPerTransaction: 1,
		});

		await bundleDrop.setClaimCondition(0, claimConditionFactory);
		console.log(
			'✅ Successfully set claim condition on bundle drop:',
			bundleDrop.address
		);
	} catch (error) {
		console.error('Failed to set claim condition', error);
	}
};

setClaimCondition();
