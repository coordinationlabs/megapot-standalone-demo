import { BaseJackpotAbi } from '@/lib/abi';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { useUsersInfo, useTokenName, useTokenDecimals } from '@/lib/queries';
import { useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Loading } from '../ui/loading';

export function WithdrawWinnings({
    walletAddress,
}: {
    walletAddress: `0x${string}` | undefined;
}) {
    const { data: writeData, error: writeError, isError: isWriteError, isPending: isWritePending, writeContract } = useWriteContract();

    // Fetch user info, token name, and decimals
    const { data: userInfo, isLoading: isLoadingInfo, error: errorInfo } = useUsersInfo(walletAddress);
    const { data: tokenName, isLoading: isLoadingName, error: errorName } = useTokenName();
    const { data: tokenDecimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingInfo || isLoadingName || isLoadingDecimals;
    const error = errorInfo || errorName || errorDecimals;

    const displayDecimals = tokenDecimals ?? 18;
    const displayName = tokenName ?? 'TOKEN';
    const winningsWei = userInfo?.winningsClaimable ?? 0n; // Get winnings from userInfo, default to 0n
    const winningsFormatted = (Number(winningsWei) / (10 ** displayDecimals)).toLocaleString(undefined, { maximumFractionDigits: displayDecimals > 0 ? 2 : 0 });

    const handleWithdraw = async () => {
        if (winningsWei === 0n) return; // Don't withdraw if no winnings

        writeContract?.({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: 'withdrawWinnings',
            args: [],
        });
    };

    let content;
    if (isLoading) {
        content = <Loading className="h-8 w-24" containerClassName="p-2" />;
    } else if (error) {
        content = <p className="text-lg text-red-500">Error loading winnings.</p>;
    } else {
        content = (
            <>
                <p className="text-lg">
                    {winningsFormatted} {displayName}
                </p>
                <Button
                    onClick={handleWithdraw}
                    disabled={isWritePending || winningsWei === 0n} // Disable if pending or no winnings
                    className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-400"
                >
                    {isWritePending ? <Loading className="h-5 w-5 mr-2" containerClassName="p-0 inline-flex" /> : null}
                    Withdraw
                </Button>
                {isWriteError && (
                     <p className="text-xs text-red-500 mt-1">Error: {writeError?.message || 'Transaction failed'}</p>
                 )}
            </>
        );
    }


    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <h1 className="text-2xl font-bold">Withdraw Winnings</h1>
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}
