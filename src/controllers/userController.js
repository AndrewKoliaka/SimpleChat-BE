import User from '../models/userModel';
import jwtUtils from '../utils/jwt';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

export async function loginUser (req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            const tokenData = { id: user._id, name: user.name, email: user.email };
            const token = await jwtUtils.sign(tokenData);

            res.cookie('token', token);
            res.sendStatus(204);
        } else {
            res.status(404).json({ info: 'User not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function registerUser (req, res) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(409).json({ info: 'User exists' });
        const createdUser = await User.create({ name, email, password });
        const tokenData = { id: createdUser._id, name: createdUser.name, email: createdUser.email };
        const token = await jwtUtils.sign(tokenData);

        res.cookie('token', token);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function getUserList (req, res) {
    const { id } = req.tokenData;

    try {
        const getUserPromise = User.findOne({ _id: id });
        const getUserListPromise = User.find()
            .where('_id').ne(id)
            .select(['name', 'email', 'banList'])
            .then(results => results.filter(userItem => !~userItem.banList.indexOf(id)));

        const results = await Promise.all([getUserPromise, getUserListPromise]);

        const currentUser = results[0];
        const userList = results[1];

        res.status(200).json({ data: { userList, banList: currentUser.banList } });
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function updateUser (req, res) {
    const { name } = req.body;
    const { id } = req.params;

    try {
        await User.updateOne({ _id: id }, { name });
        const newTokenData = { id: req.tokenData.id, email: req.tokenData.email, name };
        const newToken = await jwtUtils.sign(newTokenData);

        res.cookie('token', newToken);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function deleteUser (req, res) {
    const { id } = req.params;

    try {
        await User.deleteOne({ _id: id });
        res.clearCookie('token');
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function blockUser (req, res) {
    const blockUserId = req.params.id;
    const userId = req.tokenData.id;

    try {
        await User.updateOne({ _id: userId }, { $addToSet: { banList: ObjectId(blockUserId) } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function unBlockUser (req, res) {
    const unBlockUserId = req.params.id;
    const userId = req.tokenData.id;

    try {
        await User.updateOne({ _id: userId }, { $pull: { banList: ObjectId(unBlockUserId) } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json(error);
    }
};
