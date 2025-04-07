import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Driver from '../models/Driver';
import bcrypt from 'bcryptjs';
interface AuthRequest extends Request {
  body: {
    username: string;
    password: string;
    busNumber?: string;
  };
}

export const registerDriver = async (req: Request, res: Response) => {
  try {
    const password=await bcrypt.hash(req.body.password, 10)
    const driver = new Driver({
        username:req.body.username,
        password:password,
        busNumber:req.body.busNumber
    });
    await driver.save();
    console.log("Saved successfully");
      res.status(201).json({  busNumber: driver.busNumber });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginDriver = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.body)
    const driver = await Driver.findOne({ username: req.body.username });
    console.log(driver)
    if (!driver || !(await driver.comparePassword(req.body.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("I am here ")
    const token = jwt.sign(
      { driverId: driver._id },
      process.env.TOKEN_KEY!,
      { expiresIn: '8h' }
    );

    res.status(201).json({ token, busNumber: driver.busNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
