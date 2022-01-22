import sdk from './1-initialize-sdk.js';

import dotenv from 'dotenv';
dotenv.config();

const app = sdk.getAppModule(process.env.APP_MODULE_ADDRESS);

const deployToken = async () => {
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
};

deployToken();
