import sdk from './1-initialize-sdk.js';

const appModule = sdk.getAppModule(
	'0xBaD0920F30DA5030f001bAF6F900118E63e54204'
);

const deployVote = async () => {
	try {
		const voteModule = await appModule.deployVoteModule({
			// Give your governance contract a name.
			name: "StackoverDAO's Proposals",
			votingTokenAddress: '0x7eFd41324f4a3666E659c42190DA0C0F6820BC91',
			// After a proposal is created, when can members start voting?
			proposalStartWaitTimeInSeconds: 0,
			// How long do members have to vote on a proposal when it's created?
			proposalVotingTimeInSeconds: 24 * 60 * 60, // 24 hours
			votingQuorumFraction: 0,
			// What's the minimum # of tokens a user needs to be allowed to create a proposal?
			minimumNumberOfTokensNeededToPropose: '1',
		});

		console.log(
			'✅ Successfully deployed vote module, address:',
			voteModule.address
		);
	} catch (err) {
		console.error('Failed to deploy vote module', err);
	}
};

deployVote();
