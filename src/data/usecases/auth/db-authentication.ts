import {
    Authentication, AuthenticationModel,
    HashComparer, TokenGenerator,
    LoadAccountByEmailRepository, UpdateAccessTokenRepository
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;
    private readonly tokenGenerator: TokenGenerator;
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

    constructor (
        loadAccountByEmailRepo: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator,
        updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepo = loadAccountByEmailRepo;
        this.hashComparer = hashComparer;
        this.tokenGenerator = tokenGenerator;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }

    async auth (auth: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepo.load(auth.email);
        if (!account) return null;
        const isValid = await this.hashComparer.compare(auth.password, account.password);
        if (!isValid) return null;
        const accessToken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessTokenRepository.update(account.id, accessToken);
        return accessToken;
    };
}
