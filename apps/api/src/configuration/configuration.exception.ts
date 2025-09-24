export class SecretVersionDataIsUndefinedExepction extends Error {
  constructor() {
    super();
  }
}

export class ConfigurationIsEmptyException extends Error {
  constructor() {
    super();
  }
}

export type AnyConfigurationException =
  | SecretVersionDataIsUndefinedExepction
  | ConfigurationIsEmptyException;
