import { StudentModel } from '../model/student.model';
import { ProfessorModel } from '../model/professor.model';
import { UserModel } from '../model/user.model';
import bcrypt from 'bcryptjs';

export const getUsers = async () => {
    const users = await UserModel.find({});
    return users;
}

export const getUser = async (id: string) => {
    let user;
    try {
        user = await UserModel.findOne({ _id: id })
        .populate('student')
        .populate({
            path: 'student',
            populate: [
            { path: 'majors'},
            { path: 'minors'},
            { path: 'coursesTaken'},
            { path: 'currentCourses'},
            { path: 'shoppingCart'},
            { path: 'friends', populate: { path: 'user' }},
            ]
        })
        .populate('professor')
        console.log('the user is', user)
    }
    catch (err) {
        console.log('Error getting user', err);
    }
    return user;
}

export const createUser = async (user: object) => {
    let data = {};
    try {
        data = await UserModel.create(user);
    } catch (err) {
        console.log('Error::' + err);
    }
    return data;
}

export const updateUser = async (id: string, user: object) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate({ _id: id }, user, { new: true }) as object;
        return updatedUser;
    } catch (err) {
        console.log('Error::' + err);
    }
}

export const deleteUser = async (id: string) => {
    try {
        let userDeleted: object = await UserModel.findById(id) as object;
        let deletedCount: number = await (await UserModel.deleteOne({ _id: id })).deletedCount;
        if (deletedCount === 1) {
            return { userDeleted };
        }
    } catch (err) {
        console.log('Error::' + err);
    }
}

// ------------- AUTH ------------- //

async function comparePassword(password: string, existingPassword: string) {
    const comparison = await bcrypt.compare(password, existingPassword);
    return comparison;
  };

export const login = async (user: any) => {
    let foundUser;
    try {
        foundUser = await UserModel.findOne({username: user.username});
        if (foundUser) {
            const isMatch = await comparePassword(user.password, foundUser.password);
            if (isMatch) return foundUser;
        }
        return  {
            "status": 404,
            "type": "NOT_FOUND",
            "message": "User not found. Incorrect email or password."
        };
    } catch (err) {
        console.log('Error::' + err);
        return  {
            "status": 404,
            "type": "ERROR_IN_LOGIN",
            "message": "Error in login."
        };
    }
}


export const register = async (userObject: {user: {username: String, email: String, netID: String, profileImageUrl:String, firstName:String, lastName:String}, student: Object, professor:Object}) => {
    try {
        console.log('userObject', userObject)
        // validate that username, netID, and email are unique
        const foundUsername = await UserModel.findOne({username: userObject.user.username});
        const foundNetID = await UserModel.findOne({netID: userObject.user.netID})
        const foundEmail = await UserModel.findOne({email: userObject.user.email});

        const errors = []
        if (foundUsername) {
            errors.push("Username in use");
        }
        if (userObject.student && foundNetID) {
            errors.push("NetID in use");
        }
        if (foundEmail) {
            errors.push("Email in use");
        }
        if (errors.length) {
            console.log('got in errors', errors);
            return {errors};
        } else {
            if (userObject.student){
                const user =  await UserModel.create(userObject.user);
                await StudentModel.create(userObject.student);
                const foundStudent = await StudentModel.findOne(userObject.student);
                const udpatedUser = await UserModel.findByIdAndUpdate(user._id, {$set: {student: foundStudent?._id}});
                await StudentModel.updateOne(userObject.student, {$set: {user: user?._id}});
                return udpatedUser;                
            }
            if (userObject.professor){
                await UserModel.find({firstName:userObject.user.firstName, lastName: userObject.user.lastName}).remove();
                const newUser =  await UserModel.create(userObject.user);
                const name = userObject.user.firstName + ' ' + userObject.user.lastName;
                const foundProf = ProfessorModel.find({name: name});
                if (foundProf) {
                    // if there's a professor with the same name, update the professor's user field
                    await ProfessorModel.updateOne(foundProf, {$set: {user: newUser?._id}});
                } else {
                    // if there's no professor with the same name, create a new professor
                    await ProfessorModel.create(userObject.professor);
                }

                await StudentModel.create(userObject.student);
                const udpatedUser = await UserModel.findByIdAndUpdate(foundProf._id, {$set: {professor: foundProf?._id}});
                await ProfessorModel.updateOne(userObject.professor, {$set: {user: user?._id}});
                console.log('udpatedUser professor', udpatedUser)
                return udpatedUser;                
            }
        }
    } catch (err) {
        console.log('Error::' + err);
    }
}