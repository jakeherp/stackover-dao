import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

import './index.css';

const supportedBlockchainIds = [4]; // List of possible ids: https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/

const connectors = {
	// Metamask is an "injected wallet"
	injected: {},
};

ReactDOM.render(
	<React.StrictMode>
		<ThirdwebWeb3Provider
			connectors={connectors}
			supportedChainIds={supportedBlockchainIds}
		>
			<App />
		</ThirdwebWeb3Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
