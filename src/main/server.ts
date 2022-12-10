import { MongoHelper } from "../infra/db/mongodb/mongo-helpers";
import env from "./config/env";

MongoHelper.connect(env.mongoURL)
    .then(async () => {
        const app = (await import("./config/app")).default;
        app.listen(env.port, () => console.log(`Server listening on port ${env.port}`));
    })
    .catch(err => console.error(err));
