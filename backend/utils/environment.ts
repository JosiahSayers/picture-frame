export class Environment {
  private static requireEnv(name: string): string {
    const value = Bun.env[name];
    if (!value) {
      throw new MissingEnvironmentVariableError(name);
    }
    return value;
  }

  static get storagePath(): string {
    if (Bun.env.NODE_ENV === 'development') {
      return './temp/storage';
    }

    return Bun.env.STORAGE_PATH || '/storage';
  }
}

class MissingEnvironmentVariableError extends Error {
  constructor(variableName: string) {
    super(`Missing required ENV variable: ${variableName}`);
  }
}
