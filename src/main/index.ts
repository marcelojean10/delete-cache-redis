import Redis from 'ioredis';

const redisData = {
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: {
        host: process.env.REDIS_HOST
      }
    }
  },
  driver: 'redis'
}

// Crie uma instância do cliente Redis
const redis = new Redis(redisData.config.redis);

// Padrão de chaves que você deseja buscar
const keyPattern = '*key*';

async function deleteKeysWithPattern() {
  const stream = redis.scanStream({
    match: keyPattern,
  });

  stream.on('data', async (keys: any) => {
    for (const key of keys) {
      const load = await redis.del(key);
      console.log(`Chave excluída: ${key}`);
    }
  });

  stream.on('end', () => {
    // Encerre a conexão com o Redis
    redis.quit();
  });
}

// Execute a função para buscar e excluir chaves
deleteKeysWithPattern();