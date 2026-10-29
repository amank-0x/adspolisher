import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required in .env");
}

// global declaration
declare global {
    var prismaGlobal: PrismaClient | undefined;
}

// for serverless enviroment
const getPrismaClient = () => {
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
};

const prismaClient = globalThis.prismaGlobal ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prismaClient;
}

const isTransientDatabaseError = (error: unknown) => {
    if (!error || typeof error !== "object") return false;
    const candidate = error as { code?: string; message?: string };
    return candidate.code === "ETIMEDOUT" || candidate.message?.includes("Connection terminated unexpectedly") === true || candidate.message?.includes("Can't reach database server") === true;
};

export async function withDatabaseRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (!isTransientDatabaseError(error) || attempt === retries) throw error;
            await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
        }
    }
    throw lastError;
}

export default prismaClient;
