import React, { useEffect, useMemo, useState } from 'react';

import { ThirdwebSDK } from '@3rdweb/sdk';
import { useWeb3 } from '@3rdweb/hooks';

const sdk = new ThirdwebSDK('rinkeby');

const bundleDropModule = sdk.getBundleDropModule(
	'0x23c37536A17cCd6468b585Da35bE851e3458291A'
);

const App = () => {
	const [hasClaimedNft, setHasClaimedNft] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);
	const { connectWallet, address, error, provider } = useWeb3();

	const signer = provider ? provider.getSigner() : undefined;

	useEffect(() => {
		if (signer) sdk.setProviderOrSigner(signer);
	}, [signer]);

	useEffect(() => {
		if (!address) return;

		bundleDropModule
			.balanceOf(address, '0')
			.then((balance) => {
				if (balance.gt(0)) {
					setHasClaimedNft(true);
				} else {
					setHasClaimedNft(false);
				}
			})
			.catch((error) => {
				setHasClaimedNft(false);
				console.error('failed to get NFT balance', error);
			});
	}, [address]);

	console.log(`hasClaimedNft`, hasClaimedNft);

	const handleConnect = () => connectWallet('injected');

	const mintNft = () => {
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

	if (!address) {
		return (
			<div className="landing">
				<h1>Welcome to StackoverDAO</h1>
				<button onClick={handleConnect} className="btn-hero">
					Connect your wallet
				</button>
			</div>
		);
	}

	return (
		<div className="landing">
			<h1>Welcome to StackoverDAO</h1>
			{hasClaimedNft ? (
				<div className="member-page">
					<h2>🍪DAO Member Page</h2>
					<p>Congratulations on being a member</p>
				</div>
			) : (
				<div className="mint-nft">
					<h2>Mint your free StackoverDAO Membership NFT</h2>
					<button disabled={isClaiming} onClick={() => mintNft()}>
						{isClaiming ? 'Minting...' : 'Mint your NFT for free'}
					</button>
				</div>
			)}
		</div>
	);
};

export default App;
