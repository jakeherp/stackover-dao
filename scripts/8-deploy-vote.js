import sdk from './1-initialize-sdk.js';

import dotenv from 'dotenv';
dotenv.config();

const appModule = sdk.getAppModule(process.env.APP_MODULE_ADDRESS);

const deployVote = async () => {
	try {
		const voteModule = await appModule.deployVoteModule({
			// Give your governance contract a name.
			name: "StackoverDAO's Proposals",
			votingTokenAddress: process.env.TOKEN_MODULE_ADDRESS,
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
