import {Request, Response, Router} from 'express';
import {storage} from "../storage/storage";
import {Item} from "../types/Item";
import {server} from "../index";

const router: Router = Router();

router.post('/items', (req: Request, res: Response) => {
    console.log("Updated ME data");
    storage['items'] = req.body as Item[];
    res.status(200).send();
    server.clients.forEach(client => client.emit("message",storage['items']));
});

export default router;
