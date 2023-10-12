import express from "express";
import { PORT } from "./configs";
import bodyParser from "body-parser";
import { MyResponse } from "./response";
import Search from "./search";

const app = express();

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const search = new Search();

app.route('/')
    .post(async (req, res) => {        
        const keyword = req.body.keyword;
        const type = req.body.type;
        
        if (!keyword) res.send(new MyResponse(0, 'error', "null keyword!"));
        else {
            try {
                const result = await search.search(keyword, type);
                res.send(new MyResponse(0, 'data', result));
            } catch (error) {
                console.log(error);
                res.send(new MyResponse(0, 'error', error));
            }
        }
    })

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})