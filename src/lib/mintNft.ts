import { BundleDropModule } from '@3rdweb/sdk';

type SetStateFn = (value: React.SetStateAction<boolean>) => void;

export const mintNft = (
	setIsClaiming: SetStateFn,
	setHasClaimedNft: SetStateFn,
	bundleDropModule: BundleDropModule
) => {
	setIsClaiming(true);
	bundleDropModule
		.claim('0', 1)
		.then(() => {
			setHasClaimedNft(true);
			console.log(
				`🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
			);
		})
		.catch((err) => {
			console.error('failed to claim', err);
		})
		.finally(() => {
			setIsClaiming(false);
		});
};
