import { HttpRequest, Validation } from "../../../../src/presentation/protocols";
import { AddSurveyController } from "../../../../src/presentation/controllers/survey/add-survey-controller";
import { badRequest } from "../../../../src/presentation/helpers/http/http-helper";

type SutTypes = {
    sut: AddSurveyController,
    validationStub: Validation,
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: "any_question",
        answer: [
            { image: "any_image", answer: "any_answer"}
        ],
    }
})

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
    const sut = new AddSurveyController(validationStub)
    return {
        sut, validationStub
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
})
