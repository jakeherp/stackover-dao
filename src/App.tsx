import React, { useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { ThirdwebSDK } from '@3rdweb/sdk';
import { useWeb3 } from '@3rdweb/hooks';

const sdk = new ThirdwebSDK('rinkeby');

const bundleDropModule = sdk.getBundleDropModule(
	'0x23c37536A17cCd6468b585Da35bE851e3458291A'
);

const tokenModule = sdk.getTokenModule(
	'0x7eFd41324f4a3666E659c42190DA0C0F6820BC91'
);

const App = () => {
	const [hasClaimedNft, setHasClaimedNft] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);
	const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
	const [memberAddresses, setMemberAddresses] = useState([]);

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

	useEffect(() => {
		if (!hasClaimedNft) return;

		// get all the addresses of our members who hold an NFT
		bundleDropModule
			.getAllClaimerAddresses('0')
			.then((addresses) => {
				setMemberAddresses(addresses as any);
			})
			.catch((err) => {
				console.error('failed to get member list', err);
			});

		// Grab all the balances
		tokenModule
			.getAllHolderBalances()
			.then((amounts) => {
				setMemberTokenAmounts(amounts);
			})
			.catch((err) => {
				console.error('failed to get token amounts', err);
			});
	}, [hasClaimedNft]);

	const memberList = useMemo(() => {
		return memberAddresses.map((address) => {
			return {
				address,
				tokenAmount: ethers.utils.formatUnits(
					// If the address isn't in memberTokenAmounts, it means they don't
					// hold any of our token
					memberTokenAmounts[address] || 0,
					18
				),
			};
		});
	}, [memberAddresses, memberTokenAmounts]);

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

	const shortenAddress = (str: string) => {
		return str.substring(0, 6) + '...' + str.substring(str.length - 4);
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
					<div>
						<div>
							<h2>Member List</h2>
							<table className="card">
								<thead>
									<tr>
										<th>Address</th>
										<th>Token Amount</th>
									</tr>
								</thead>
								<tbody>
									{memberList.map((member) => {
										return (
											<tr key={member.address}>
												<td>{shortenAddress(member.address)}</td>
												<td>{member.tokenAmount}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
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
