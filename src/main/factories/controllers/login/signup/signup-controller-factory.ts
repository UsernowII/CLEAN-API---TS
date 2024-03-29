import { Controller } from "../../../../../presentation/protocols";
import { SignUpController } from "../../../../../presentation/controllers/login/signup/SingUp-controller";
import { makeSignUpValidation } from "./signup-validation-factory";
import { makeDbAuthentication } from "../../../usecases/account/authentication/db-authentication-factory";
import { makeDbAddAccount } from "../../../usecases/account/addAccount/db-addAccount-factory";
import { makeLogControllerDecorator } from "../../../decorators/log-decorator-factory";

export const makeSignUpController = (): Controller => {
    const signUpController = new SignUpController(
        makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()
    );
    return makeLogControllerDecorator(signUpController);
};
