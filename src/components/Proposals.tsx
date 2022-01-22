import { Proposal } from '@3rdweb/sdk';
import React from 'react';
import SingleProposal from './SingleProposal';

interface IProps {
	handleProposal: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	proposals: Proposal[];
	isVoting: boolean;
	hasVoted: boolean;
}

const Proposals = ({
	handleProposal,
	proposals,
	isVoting,
	hasVoted,
}: IProps) => {
	return (
		<form onSubmit={handleProposal}>
			{proposals.map((proposal) => (
				<SingleProposal
					key={proposal.proposalId}
					proposal={proposal}
					hasVoted={hasVoted}
				/>
			))}
			{!hasVoted && (
				<>
					<button disabled={isVoting} type="submit">
						{isVoting
							? 'Voting...'
							: hasVoted
							? 'You Already Voted'
							: 'Submit Votes'}
					</button>
					<small>
						This will trigger multiple transactions that you will need to sign.
					</small>
				</>
			)}
		</form>
	);
};

export default Proposals;
