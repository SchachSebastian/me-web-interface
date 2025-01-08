import {Request, Response, Router} from 'express';
import {storage} from "../storage/storage";
import {Item} from "../types/Item";

const router: Router = Router();

router.post('/items', (req: Request, res: Response) => {
    console.log(req.body)
    storage['items'] = req.body as Item[];
    res.status(200).send();
});

export default router;
