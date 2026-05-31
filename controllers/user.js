import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
    const accessToken = jwt.sign({ userId: user?._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    // return accessToken;

    const refreshToken = jwt.sign({ userId: user?._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    // return refreshToken;
    return { accessToken, refreshToken };
}

const loginOrSignup = async (req, res) => {
    const { id_token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: google_id, name, email, picture, email_verified } = payload;
        if (!email_verified) {
            return res.status(400).json({ error: 'Email not verified by Google' });
        }
        let user = await User.findOne({ email });
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            user = new User({
                google_id,
                name,
                email,
                user_image: picture,
                email_verified,
                created_at: new Date(),
                updated_at: new Date(),
            });
            await user.save();
        }

        const { accessToken, refreshToken } = generateToken(user.toObject());
        // res.json({ user, accessToken, refreshToken })
        res.status(200).json({ user, accessToken, refreshToken, isNewUser });
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
}
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error('Error refreshing access token:', error);
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

}
export { loginOrSignup, refreshAccessToken };