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
        
        if (!keyword) res.send(new MyResponse(0, 'error', "null keyword!"));
        else {
            try {
                const result = await search.search(keyword);
                res.send(new MyResponse(0, 'data', result));
            } catch (error) {
                console.log(error);
                res.send(new MyResponse(1, 'error', error));
            }
        }
    });

app.route('/:type')
    .post(async (req, res) => {
        const type = req.params.type;
        const keyword = req.body.keyword;

        if (!keyword) res.send(new MyResponse(0, 'error', "null keyword!"));
        else {
            try {
                switch (type) {
                    case "user":
                        const result = await search.searchOnUser(keyword);
                        res.send(new MyResponse(0, 'data', result));
                        break
                }
            } catch (error) {
                res.send(new MyResponse(1, 'error', error));
            }
        }
    })

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})