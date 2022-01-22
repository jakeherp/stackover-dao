import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { mapVotes } from './lib/mapVotes';
import { mintNft } from './lib/mintNft';
import { UnsupportedChainIdError } from '@web3-react/core';
import { useMemberList } from './lib/useMemberList';
import { useWeb3 } from '@3rdweb/hooks';
import { Proposal, ThirdwebSDK } from '@3rdweb/sdk';

import MemberList from './components/MemberList';
import NetworkError from './components/NetworkError';
import Proposals from './components/Proposals';

const sdk = new ThirdwebSDK('rinkeby');

const bundleDropModule = sdk.getBundleDropModule(
	'0x23c37536A17cCd6468b585Da35bE851e3458291A'
);
const tokenModule = sdk.getTokenModule(
	'0x7eFd41324f4a3666E659c42190DA0C0F6820BC91'
);
const voteModule = sdk.getVoteModule(
	'0x1BcA5B5c33456C8DCc0ADa2f6E3249346122a903'
);

const App = () => {
	const [hasClaimedNft, setHasClaimedNft] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);
	const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
	const [memberAddresses, setMemberAddresses] = useState<string[]>([]);
	const [proposals, setProposals] = useState<Proposal[]>([]);
	const [isVoting, setIsVoting] = useState(false);
	const [hasVoted, setHasVoted] = useState(false);

	const { connectWallet, address, provider, error } = useWeb3();

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
				setMemberAddresses(addresses);
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

		// Grab all proposals
		voteModule
			.getAll()
			.then((proposals) => {
				setProposals(proposals);
			})
			.catch((err) => {
				console.error('failed to get proposals', err);
			});
	}, [hasClaimedNft]);

	useEffect(() => {
		if (!hasClaimedNft || !proposals.length) return;

		// Check if the user has already voted on the first proposal.
		voteModule
			.hasVoted(proposals[0].proposalId, address)
			.then((hasVoted) => {
				setHasVoted(hasVoted);
				if (hasVoted) {
					console.log('User has already voted');
				} else {
					console.log('User has not voted yet');
				}
			})
			.catch((err) => {
				console.error('failed to check if wallet has voted', err);
			});
	}, [hasClaimedNft, proposals, address]);

	const memberList = useMemberList(memberAddresses, memberTokenAmounts);

	const handleConnect = () => connectWallet('injected');

	const handleMinting = () =>
		mintNft(setIsClaiming, setHasClaimedNft, bundleDropModule);

	const handleProposal = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		//before we do async things, we want to disable the button to prevent double clicks
		setIsVoting(true);

		// lets get the votes from the form for the values
		const votes = mapVotes(proposals);

		// first we need to make sure the user delegates their token to vote
		try {
			//we'll check if the wallet still needs to delegate their tokens before they can vote
			const delegation = await tokenModule.getDelegationOf(address!);
			// if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
			if (delegation === ethers.constants.AddressZero) {
				//if they haven't delegated their tokens yet, we'll have them delegate them before voting
				await tokenModule.delegateTo(address!);
			}
			// then we need to vote on the proposals
			try {
				await Promise.all(
					votes.map(async (vote) => {
						// before voting we first need to check whether the proposal is open for voting
						// we first need to get the latest state of the proposal
						const proposal = await voteModule.get(vote.proposalId);
						// then we check if the proposal is open for voting (state === 1 means it is open)
						if (proposal.state === 1) {
							// if it is open for voting, we'll vote on it
							return voteModule.vote(vote.proposalId, vote.vote);
						}
						// if the proposal is not open for voting we just return nothing, letting us continue
						return;
					})
				);
				try {
					// if any of the propsals are ready to be executed we'll need to execute them
					// a proposal is ready to be executed if it is in state 4
					await Promise.all(
						votes.map(async (vote) => {
							// we'll first get the latest state of the proposal again, since we may have just voted before
							const proposal = await voteModule.get(vote.proposalId);

							//if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
							if (proposal.state === 4) {
								return voteModule.execute(vote.proposalId);
							}
						})
					);
					// if we get here that means we successfully voted, so let's set the "hasVoted" state to true
					setHasVoted(true);
					// and log out a success message
					console.log('successfully voted');
				} catch (err) {
					console.error('failed to execute votes', err);
				}
			} catch (err) {
				console.error('failed to vote', err);
			}
		} catch (err) {
			console.error('failed to delegate tokens');
		} finally {
			// in *either* case we need to set the isVoting state to false to enable the button again
			setIsVoting(false);
		}
	};

	if (error instanceof UnsupportedChainIdError) {
		return <NetworkError />;
	}

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
							<MemberList memberList={memberList} />
						</div>
						<div>
							<h2>Active Proposals</h2>
							<Proposals
								handleProposal={handleProposal}
								proposals={proposals}
								isVoting={isVoting}
								hasVoted={hasVoted}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="mint-nft">
					<h2>Mint your free StackoverDAO Membership NFT</h2>
					<button disabled={isClaiming} onClick={handleMinting}>
						{isClaiming ? 'Minting...' : 'Mint your NFT for free'}
					</button>
				</div>
			)}
		</div>
	);
};

export default App;
