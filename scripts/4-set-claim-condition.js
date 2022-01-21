import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
	'0x23c37536A17cCd6468b585Da35bE851e3458291A'
);

(async () => {
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
})();
