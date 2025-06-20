import { Router } from "express";
import UserMiddleware from "../middleware/userMiddleware";
import UserService from "../services/userService";

const router = Router();
const userMiddleware = new UserMiddleware();
const userService = new UserService();

//This route is for the user login
router.post('/login', userMiddleware.login.bind(userMiddleware), userService.login.bind(userService));

//This route is for the user signup
router.post('/signin',
  userMiddleware.signin.bind(userMiddleware),
  // userMiddleware.createUser.bind(userMiddleware),
  userService.signUpUser.bind(userService)
);

//This route is to create the user
router.post('/create',
  userMiddleware.verifyAdmin.bind(userMiddleware),
  userMiddleware.createUser.bind(userMiddleware),
  userService.createUser.bind(userService)
);

//This route to get the user profile
router.get('/profile',
  userMiddleware.verifyAdmin.bind(userMiddleware),
  userService.getProfile.bind(userService)
);

//This route is for the my account acess
router.get('/my/user', userMiddleware.verify.bind(userMiddleware), userService.getProfile.bind(userService));

//This route to get the all user
router.get('/all-users', userMiddleware.verifyAdmin.bind(userMiddleware), userService.getAllUsers.bind(userService));

//This route to delete the user 
router.delete('/remove/:id', userMiddleware.deleteId.bind(userMiddleware), userService.deleteById.bind(userService));

//This route to update the user status as block
router.put('/block/:id', userMiddleware.deleteId.bind(userMiddleware), userService.updateIsBlocked.bind(userService));

//This route to get the user profile by role
router.get(
  '/role/:role',
  userMiddleware.verifyAdmin.bind(userMiddleware),
  userService.getUsersByRole.bind(userService)
);

//This route to get the user profile by user id
router.get('/:id', userMiddleware.verifyAdmin.bind(userMiddleware), userService.getUserById.bind(userService))

export default router;
