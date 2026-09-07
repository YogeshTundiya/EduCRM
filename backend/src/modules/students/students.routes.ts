import { Router } from 'express';
import { StudentsController } from './students.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createStudentSchema, updateStudentSchema } from './students.schema';

const router = Router();

router.get('/', StudentsController.list);
router.get('/:id', StudentsController.getById);
router.post('/', validate(createStudentSchema), StudentsController.create);
router.put('/:id', validate(updateStudentSchema), StudentsController.update);
router.delete('/:id', StudentsController.delete);

export default router;
