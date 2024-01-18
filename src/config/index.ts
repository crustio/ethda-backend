export const CONFIGS = {
    common: {
        env: getEnv('ENV', 'dev'),
    },
    server: {
        port: getEnv('PORT', 3000)
    },
    db: {
        host: getEnv('DB_HOST', 'localhost'),
        port: getEnv('DB_PORT', 15432),
        database: 'blobscan_dev',
        user: getEnv('DB_USER', 'ethda'),
        password: getEnv('DB_PASSWORD', ''),
    },
    chain: {
        rpcUrl: getEnv('RPC_URL', 'https://rpc-devnet.ethda.io')
    }
}

export function getEnv(key: string, defaultValue: string | number): string | number {
    const result = process.env[key] || defaultValue;
    return typeof defaultValue === 'string' ? result : Number(result);
}
