import MemberRow from './MemberRow';
import React from 'react';

interface IProps {
	memberList: Array<{
		address: string;
		tokenAmount: string;
	}>;
}

const MemberList = ({ memberList }: IProps) => {
	return (
		<table className="card">
			<thead>
				<tr>
					<th>Address</th>
					<th>Token Amount</th>
				</tr>
			</thead>
			<tbody>
				{memberList.map(({ address, tokenAmount }) => {
					return (
						<MemberRow
							address={address}
							tokenAmount={tokenAmount}
							key={address}
						/>
					);
				})}
			</tbody>
		</table>
	);
};

export default MemberList;
