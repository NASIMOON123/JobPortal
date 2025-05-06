import express from "express";
import { login, register, logout, getUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import sendAcceptanceEmail from './sendEmail.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

router.patch('/accept/:id', async (req, res) => {
    const applicationId = req.params.id;
    const { email, name } = req.body; // Assuming you send email and name in the request body
  
    try {
      
      await sendAcceptanceEmail(email, name);
  
      res.status(200).json({ message: 'Application accepted and email sent.' });
    } catch (error) {
      res.status(500).json({ message: 'Error accepting application or sending email.', error });
    }
  });

  router.patch('/reject/:id', async (req, res) => {
    const applicationId = req.params.id;
    const { email, name } = req.body; // Assuming you send email and name in the request body
  
    try {
      
      await sendAcceptanceEmail(email, name);
  
      res.status(200).json({ message: 'Application Rejected and email sent.' });
    } catch (error) {
      res.status(500).json({ message: 'Error rejecting application or sending email.', error });
    }
  });

export default router;
