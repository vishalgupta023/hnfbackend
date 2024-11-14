const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { rolesConst } = require("../utils/constants");
const responseHandler = require("../utils/responseHandler");
const { userLog } = require("./logController");

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ status: 401, message: 'Invalid credentials' });
        }
        const token = createToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        userLog(user, "LOGIN", "User LogIn");
        res.status(200).json({ status: 200, message: "login successful" });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
}



const signUpUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return responseHandler.generateError(res, "user already exists")
        }
        user = new User({
            name,
            email,
            password: password,
            role: rolesConst.user,
        });

        await user.save();

        const token = createToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        //activity log (signup);
        userLog(user, "SIGNUP", "User Registered");

        responseHandler.generateSuccess(res, "user registered !", { token });
    } catch (error) {
        console.error('Signup error:', error.message);
        responseHandler.generateError(res, "Internal server error");
    }
}

const checkAuthenticUser = async (req, res) => {
    const token = req?.cookies?.token;
    if (!token) {
        responseHandler.generateForbiddenError(res);
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new Error("Decode from jwt is not found !")
        }

        const epochDateTime = decoded.exp * 1000;
        const currentDateTime = Date.now();
        const isExpired = epochDateTime < currentDateTime
        if (isExpired) {
            throw new Error("Session Expired Login Again!")
        }
        const userId = decoded.userId;
        if (!userId) throw new Error("no user found for given token!");
        const user = await User.findById(userId).select("-password");
        if (!user) throw new Error("user not found in database")
        responseHandler.generateSuccess(res, "authentic user", { user })
    } catch (err) {
        console.log("Error in user auth check  ", err.message)
        responseHandler.generateForbiddenError(res);
    }
}

const logout = async (req, res) => {
    try {
        const token = req?.cookies?.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            const userId = decoded.userId;
            const user = await User.findById(userId);
            userLog(user, "LOGOUT", "User Log out");
        }
        res.clearCookie('token', { path: '/' });
        res.status(200).send('Logged out successfully');
    } catch (error) {
        responseHandler.generateError(res, "Fail to log out!")
    }
}

const createSuperAdmin = async () => {
    try {
      // Check if an admin already exists
      const isAlreadyCreated = await User.findOne({ role: "ADMIN" });
  
      // If an admin already exists, we don't need to create a new one
      if (isAlreadyCreated) {
        console.log("Super Admin already exists.");
        return;
      }
  
      // If no admin exists, create a new super admin
      const superAdmin = new User({
        name: "Super Admin",
        email: "admin@test.com",
        password: "admin123", 
        role: "ADMIN",
      });
  
      // Save the super admin to the database
      await superAdmin.save();
      console.log("Super Admin created successfully.");
  
    } catch (error) {
      console.error("Error creating super admin: ", error);
    }
  };



module.exports = {
    loginUser: loginUser,
    signUpUser: signUpUser,
    checkAuthenticUser, checkAuthenticUser,
    logout: logout,
    createSuperAdmin ,createSuperAdmin
}