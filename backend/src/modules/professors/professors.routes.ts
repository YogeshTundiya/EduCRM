import { Router } from 'express';
import { ProfessorsController } from './professors.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createProfessorSchema, updateProfessorSchema } from './professors.schema';

const router = Router();

router.get('/', ProfessorsController.list);
router.get('/:id', ProfessorsController.getById);
router.post('/', validate(createProfessorSchema), ProfessorsController.create);
router.put('/:id', validate(updateProfessorSchema), ProfessorsController.update);
router.delete('/:id', ProfessorsController.delete);

export default router;
