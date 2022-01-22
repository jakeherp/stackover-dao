import { ethers } from 'ethers';
import { useMemo } from 'react';

export const useMemberList = (
	memberAddresses: string[],
	memberTokenAmounts: Record<string, unknown>
) => {
	return useMemo(() => {
		return memberAddresses.map((address) => {
			return {
				address,
				tokenAmount: ethers.utils.formatUnits(
					// If the address isn't in memberTokenAmounts, it means they don't
					// hold any of our toke
					// @ts-expect-error // TODO: fix TS
					memberTokenAmounts[address] || 0,
					18
				),
			};
		});
	}, [memberAddresses, memberTokenAmounts]);
};
