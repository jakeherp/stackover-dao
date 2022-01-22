import { Proposal } from '@3rdweb/sdk';

export const mapVotes = (proposals: Proposal[]) =>
	proposals.map((proposal) => {
		const voteResult = {
			proposalId: proposal.proposalId,
			//abstain by default
			vote: 2,
		};
		proposal.votes.forEach((vote) => {
			const elem = document.getElementById(
				proposal.proposalId + '-' + vote.type
			);

			// @ts-expect-error // TODO: fix TS
			if (elem?.checked) {
				voteResult.vote = vote.type;
				return;
			}
		});
		return voteResult;
	});
