import React, { useEffect, useMemo, useState } from 'react';

import { useWeb3 } from '@3rdweb/hooks';

const App = () => {
	const { connectWallet, address, error, provider } = useWeb3();

	const handleConnect = () => connectWallet('injected');

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
			<p>Connected as {address}</p>
		</div>
	);
};

export default App;
