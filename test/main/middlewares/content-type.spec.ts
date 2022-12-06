import request from "supertest";
import app from "../../../src/main/config/app";

describe('Content Type Middleware', () => {
	test('Should default response content type as Json', async () => {
		app.get("/test_content_type_Json", (req, res) => {
			res.send();
		})
		await request(app)
			.get("/test_content_type_Json")
			.expect("Content-Type", "application/json; charset=utf-8");
	});
	test('Should response content type as XML', async () => {
		app.get("/test_content_type_XML", (req, res) => {
			res.type("xml")
			res.send();
		})
		await request(app)
			.get("/test_content_type_XML")
			.expect("Content-Type", /xml/);
	});
});