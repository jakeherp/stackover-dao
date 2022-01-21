import sdk from './1-initialize-sdk.js';

const app = sdk.getAppModule('0xBaD0920F30DA5030f001bAF6F900118E63e54204');

(async () => {
	try {
		const tokenModule = await app.deployTokenModule({
			name: 'StackoverDAO Governance Token',
			symbol: 'STACK',
		});
		console.log(
			'✅ Successfully deployed token module, address:',
			tokenModule.address
		);
	} catch (error) {
		console.error('failed to deploy token module', error);
	}
})();
