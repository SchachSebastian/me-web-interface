import {Request, Response, Router} from 'express';
import {storage} from "../storage/storage";

const router: Router = Router();

router.get('/items', (req: Request, res: Response) => {
    res.json(storage['items']);
});

export default router;
