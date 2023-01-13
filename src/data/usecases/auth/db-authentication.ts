import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hashComparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/loadAccountByEmailRepository";
import { TokenGenerator } from "../../protocols/criptography/tokenGenerator";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;
    private readonly tokenGenerator: TokenGenerator;

    constructor (
        loadAccountByEmailRepo: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator
    ) {
        this.loadAccountByEmailRepo = loadAccountByEmailRepo;
        this.hashComparer = hashComparer;
        this.tokenGenerator = tokenGenerator;
    }

    async auth (auth: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepo.load(auth.email);
        if (account) {
            const isValid = await this.hashComparer.compare(auth.password, account.password);
            if (isValid) {
                return await this.tokenGenerator.generate(account.id);
            }
        }
        return null;
    };
}
