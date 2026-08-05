class CONFIGURATION {
  constructor() {
    this.SyscoinVaultManager =
      process.env.SYSCOIN_VAULT_MANAGER || "0x7904299b3D3dC1b03d1DdEb45E9fDF3576aCBd5f";
  }
}

module.exports = new CONFIGURATION();
