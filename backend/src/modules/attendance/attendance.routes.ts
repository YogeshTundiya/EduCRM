import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { validate } from '../../middlewares/validate.middleware';
import { markAttendanceSchema } from './attendance.schema';

const router = Router();

router.get('/', AttendanceController.getRoster);
router.post('/', validate(markAttendanceSchema), AttendanceController.mark);
router.get('/students/:id', AttendanceController.getStudentHistory);

export default router;
