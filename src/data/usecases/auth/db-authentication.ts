import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hashComparer";
import { LoadAccountByEmailRepository } from "../../protocols/db/loadAccountByEmailRepository";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;

    constructor (loadAccountByEmailRepo: LoadAccountByEmailRepository, hashComparer: HashComparer) {
        this.loadAccountByEmailRepo = loadAccountByEmailRepo;
        this.hashComparer = hashComparer;
    }

    async auth (auth: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepo.load(auth.email);
        if (account) {
            await this.hashComparer.compare(auth.password, account.password);
        }
        return null;
    };
}
