import {Request, Response, Router} from 'express';
import {storage} from "../storage/storage";
import {server} from "../index";

const router: Router = Router();

router.get('/items', (req: Request, res: Response) => {
    res.json(storage['items']);
    server.clients.forEach(client => client.send(storage['items']))
});

export default router;
