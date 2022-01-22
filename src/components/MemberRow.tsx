import React from 'react';
import { shortenAddress } from '../lib/shortenAddress';

interface IProps {
	address: string;
	tokenAmount: string;
}

const MemberRow = ({ address, tokenAmount }: IProps) => {
	return (
		<tr>
			<td>{shortenAddress(address)}</td>
			<td>{tokenAmount}</td>
		</tr>
	);
};

export default MemberRow;
