import { Router } from 'express';
import { CoursesController } from './courses.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createCourseSchema, updateCourseSchema, addModuleSchema } from './courses.schema';

const router = Router();

router.get('/', CoursesController.list);
router.get('/:id', CoursesController.getById);
router.post('/', validate(createCourseSchema), CoursesController.create);
router.put('/:id', validate(updateCourseSchema), CoursesController.update);
router.delete('/:id', CoursesController.archive);

// Modules
router.post('/:id/modules', validate(addModuleSchema), CoursesController.addModule);
router.delete('/modules/:id', CoursesController.deleteModule);

export default router;
