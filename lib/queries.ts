import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import {
    getTokenName,
    getTokenDecimals,
    getTicketPrice,
    getJackpotAmount,
    getTimeRemaining,
    getLpsInfo,
    getFeeBps,
    getJackpotOdds,
    getUsersInfo,
    getTicketCountForRound,
    getTokenBalance,
    getTokenAllowance,
    getLpPoolStatus,
    getMinLpDeposit,
    getLastJackpotResults,
} from './contract';

const queryKeys = {
    tokenName: ['tokenName'],
    tokenDecimals: ['tokenDecimals'],
    ticketPriceInWei: ['ticketPriceInWei'],
    humanReadableTicketPrice: ['humanReadableTicketPrice'],
    jackpotAmount: ['jackpotAmount'],
    timeRemaining: ['timeRemaining'],
    lpsInfo: (address: `0x${string}`) => ['lpsInfo', address],
    feeBps: ['feeBps'],
    jackpotOdds: ['jackpotOdds'],
    usersInfo: (address: `0x${string}`) => ['usersInfo', address],
    ticketCountForRound: (address: `0x${string}`) => ['ticketCountForRound', address],
    tokenBalance: (address: `0x${string}`) => ['tokenBalance', address],
    tokenAllowance: (address: `0x${string}`) => ['tokenAllowance', address],
    lpPoolStatus: ['lpPoolStatus'],
    minLpDeposit: ['minLpDeposit'],
    lastJackpotResults: ['lastJackpotResults'],
};

export function useTokenName() {
    return useQuery({
        queryKey: queryKeys.tokenName,
        queryFn: getTokenName,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useTokenDecimals() {
    return useQuery({
        queryKey: queryKeys.tokenDecimals,
        queryFn: getTokenDecimals,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useTicketPriceInWei() {
    return useQuery({
        queryKey: queryKeys.ticketPriceInWei,
        queryFn: getTicketPrice,
        staleTime: 1000 * 15, // Reduced from 5 minutes
        refetchInterval: 1000 * 15, // Reduced from 5 minutes
    });
}

export function useTicketPrice() {
    const { data: ticketPriceInWei, isLoading: isLoadingPrice, error: errorPrice } = useTicketPriceInWei();
    const { data: decimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingPrice || isLoadingDecimals;
    const error = errorPrice || errorDecimals;

    const data = (ticketPriceInWei !== undefined && decimals !== undefined)
        ? parseFloat(formatUnits(ticketPriceInWei, decimals))
        : undefined;

    return {
        data,
        isLoading,
        error,
    };
}


export function useJackpotAmount() {
    return useQuery({
        queryKey: queryKeys.jackpotAmount,
        queryFn: getJackpotAmount,
        staleTime: 1000 * 10, // Reduced from 30 seconds
        refetchInterval: 1000 * 10, // Reduced from 30 seconds
    });
}

export function useTimeRemaining() {
    return useQuery({
        queryKey: queryKeys.timeRemaining,
        queryFn: getTimeRemaining,
        staleTime: 1000 * 1, // Reduced from 5 seconds
        refetchInterval: 1000 * 1, // Reduced from 5 seconds
    });
}

export function useLpsInfo(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.lpsInfo(address!),
        queryFn: () => getLpsInfo(address!),
        enabled: !!address,
        staleTime: 1000 * 15, // Reduced from 1 minute
        refetchInterval: 1000 * 15, // Reduced from 1 minute
    });
}

export function useFeeBps() {
    return useQuery({
        queryKey: queryKeys.feeBps,
        queryFn: getFeeBps,
        staleTime: 1000 * 60 * 5, // Reduced from 1 hour
    });
}

export function useJackpotOdds() {
    return useQuery({
        queryKey: queryKeys.jackpotOdds,
        queryFn: getJackpotOdds,
        staleTime: 1000 * 30, // Reduced from 5 minutes
        refetchInterval: 1000 * 30, // Reduced from 5 minutes
    });
}

export function useUsersInfo(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.usersInfo(address!),
        queryFn: () => getUsersInfo(address!),
        enabled: !!address,
        staleTime: 1000 * 10, // Reduced from 30 seconds
        refetchInterval: 1000 * 10, // Reduced from 30 seconds
    });
}

export function useTicketCountForRound(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.ticketCountForRound(address!),
        queryFn: () => getTicketCountForRound(address!),
        enabled: !!address,
        staleTime: 1000 * 10, // Reduced from 30 seconds
        refetchInterval: 1000 * 10, // Reduced from 30 seconds
    });
}

export function useTokenBalance(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.tokenBalance(address!),
        queryFn: () => getTokenBalance(address!),
        enabled: !!address,
        staleTime: 1000 * 5, // Reduced from 15 seconds
        refetchInterval: 1000 * 5, // Reduced from 15 seconds
    });
}

export function useTokenAllowance(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.tokenAllowance(address!),
        queryFn: () => getTokenAllowance(address!),
        enabled: !!address,
        staleTime: 1000 * 30, // Reduced from 1 minute
        refetchInterval: 1000 * 30, // Reduced from 1 minute
    });
}

export function useLpPoolStatus() {
    return useQuery({
        queryKey: queryKeys.lpPoolStatus,
        queryFn: getLpPoolStatus,
        staleTime: 1000 * 15, // Reduced from 5 minutes
        refetchInterval: 1000 * 15, // Reduced from 5 minutes
    });
}

export function useMinLpDeposit() {
    return useQuery({
        queryKey: queryKeys.minLpDeposit,
        queryFn: getMinLpDeposit,
        staleTime: 1000 * 60 * 5, // Reduced from 1 hour
    });
}

export function useLastJackpotResults() {
    return useQuery({
        queryKey: queryKeys.lastJackpotResults,
        queryFn: getLastJackpotResults,
        staleTime: 1000 * 60 * 1, // Reduced from 10 minutes
    });
}
