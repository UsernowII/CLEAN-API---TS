import {
    Authentication, AuthenticationModel,
    HashComparer, Encrypter,
    LoadAccountByEmailRepository, UpdateAccessTokenRepository
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;
    private readonly encrypter: Encrypter;
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

    constructor (
        loadAccountByEmailRepo: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
        updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepo = loadAccountByEmailRepo;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }

    async auth (auth: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepo.load(auth.email);
        if (!account) return null;
        const isValid = await this.hashComparer.compare(auth.password, account.password);
        if (!isValid) return null;
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return accessToken;
    };
}
