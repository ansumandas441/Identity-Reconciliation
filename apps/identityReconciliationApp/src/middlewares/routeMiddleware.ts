import { Request, Response, NextFunction } from 'express';
import z from 'zod';

const identifySchema = z.object({
    email: z.string().email().nullable(),
    phoneNumber: z.string().nullable(),
});

const validateIdentifySchema = (req: Request, res: Response, next: NextFunction) => {
    try {
        identifySchema.parse(req.body);
        next();
    } catch (error) {
        console.log('Identify schema malformed');
        return res.status(400).json({
        error: 'Bad request',
        });
    }
};  

export default validateIdentifySchema;
