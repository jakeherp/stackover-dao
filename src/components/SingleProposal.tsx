import { Proposal } from '@3rdweb/sdk';
import React from 'react';

interface IProps {
	proposal: Proposal;
	hasVoted: boolean;
}

const SingleProposal = ({ proposal, hasVoted }: IProps) => {
	return (
		<div className="card">
			<h5>{proposal.description}</h5>
			<div>
				{proposal.votes.map((vote) => (
					<div key={vote.type}>
						<input
							type="radio"
							id={proposal.proposalId + '-' + vote.type}
							name={proposal.proposalId}
							value={vote.type}
							//default the "abstain" vote to checked
							defaultChecked={vote.type === 2}
							disabled={hasVoted}
						/>
						<label htmlFor={proposal.proposalId + '-' + vote.type}>
							{vote.label}
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default SingleProposal;
