import { createPublicClient, fallback, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: fallback([
        http('wss://base-rpc.publicnode.com'),
        http('https://base.llamarpc.com'),
        http('https://base.drpc.org'),
        http('https://base-pokt.nodies.app')
    ]),
});

if (!client) {
    throw new Error('Failed to create viem client');
}

export default client;