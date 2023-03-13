import { HttpRequest, Validation } from "../../../../src/presentation/protocols";
import { AddSurveyController } from "../../../../src/presentation/controllers/survey/add-survey-controller";
import { badRequest, serverError } from '../../../../src/presentation/helpers/http/http-helper';
import { AddSurvey, AddSurveyModel } from "./add-survey-protocols";

type SutTypes = {
    sut: AddSurveyController,
    validationStub: Validation,
    addSurveyStub: AddSurvey,
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: "any_question",
        answer: [
            { image: "any_image", answer: "any_answer"}
        ],
    }
})

const makeAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add (data: AddSurveyModel): Promise<void> {
            return Promise.resolve()
        }
    }
    return new AddSurveyStub();
}

const makeValidation = () => {
    class ValidationStub implements Validation {
        validate (_data: any): Error {
            return null;
        }

    }
    return new ValidationStub();
}


const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const addSurveyStub = makeAddSurvey();
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
        sut, validationStub, addSurveyStub
    };
}

describe("AddSurvey Controller", () => {
    test("Should call Validation with correct values", async () => {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, "validate");
        const httRequest = makeFakeRequest();
        await sut.handle(httRequest);
        expect(validateSpy).toHaveBeenCalledWith(httRequest.body);

    })
    test("Should return 400 if Validation fails", async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
        const htppResponse = await sut.handle(makeFakeRequest());
        expect(htppResponse).toEqual(badRequest(new Error()));
    })

    test("Should call AddSurvey with correct values", async () => {
        const { sut, addSurveyStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyStub, "add");
        const httRequest = makeFakeRequest();
        await sut.handle(httRequest);
        expect(addSpy).toHaveBeenCalledWith(httRequest.body);
    })
    test("Should return 500 if AddSurvey throws", async () => {
        const { sut, addSurveyStub } = makeSut();
        jest.spyOn(addSurveyStub, "add").mockRejectedValueOnce(new Error());
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    })
})
