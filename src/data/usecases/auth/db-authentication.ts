import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/loadAccountByEmailRepository";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository;

    constructor (loadAccountByEmailRepo: LoadAccountByEmailRepository) {
        this.loadAccountByEmailRepo = loadAccountByEmailRepo;
    }

    async auth (auth: AuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepo.load(auth.email);
        return null;
    };
}
