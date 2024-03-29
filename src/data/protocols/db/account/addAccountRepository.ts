import { AddAccountModel } from "../../../../domain/usecases/addAccount";
import { AccountModel } from "../../../../domain/models/account";

export interface AddAccountRepository {
    add: (account: AddAccountModel) => Promise<AccountModel>
}
