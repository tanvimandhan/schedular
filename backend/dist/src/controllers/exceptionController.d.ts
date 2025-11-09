import { Request, Response } from 'express';
export declare class ExceptionController {
    static createException(req: Request, res: Response): Promise<void>;
    static getExceptions(req: Request, res: Response): Promise<void>;
    static getExceptionById(req: Request, res: Response): Promise<void>;
    static updateException(req: Request, res: Response): Promise<void>;
    static deleteException(req: Request, res: Response): Promise<void>;
    static getEffectiveSlotForDate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=exceptionController.d.ts.map