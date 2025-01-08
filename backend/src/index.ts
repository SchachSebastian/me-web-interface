
import express, { Application } from 'express';

import errorHandler from './middlewares/errorHandler';
import getMeData from "./routes/getMeData";
import cors from 'cors';
import updateMeData from "./routes/updateMeData";

const app: Application = express();
const port: number = 3000;

app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(errorHandler);
app.use('/api', getMeData);
app.use('/api', updateMeData);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
