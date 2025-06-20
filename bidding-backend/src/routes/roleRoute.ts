import { Router } from "express";
import RoleService from "../services/roleService";
import RoleMiddleware from "../middleware/roleMiddleware";
import UserMiddleware from "../middleware/userMiddleware";


const router = Router();
const roleService = new RoleService();
const roleMiddleware = new RoleMiddleware();
const userMiddleware = new UserMiddleware();

//This route is to create the role
router.post('/',
    roleMiddleware.createRole.bind(roleMiddleware),
    roleService.createRole.bind(roleService)
);

//This route is to get the role by name
router.get('/:name',
    roleMiddleware.getRole.bind(roleMiddleware),
    roleService.getRoleId.bind(roleService),
);

//This route is to get all the permission of a role
router.get("/all/permissions",
    roleService.getPermissions.bind(roleService)
);

//This route is to update the permission of a role
router.put("/update/permissions",
    roleService.updatePermissions.bind(roleService)
);

//This route is to get all roles
router.get('/all/roles',
    roleService.getRoles.bind(roleService)
);
export default router;
