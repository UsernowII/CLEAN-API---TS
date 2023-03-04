import {
    Authentication, AuthenticationModel,
    HashComparer, Encrypter,
    LoadAccountByEmailRepository, UpdateAccessTokenRepository
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypt: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {}

    async auth (auth: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepo.loadByEmail(auth.email);
        if (!account) return null;
        const isValid = await this.hashComparer.compare(auth.password, account.password);
        if (!isValid) return null;
        const accessToken = await this.encrypt.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return accessToken;
    };
}
