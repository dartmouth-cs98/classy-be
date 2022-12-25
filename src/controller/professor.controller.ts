import { CourseModel } from '../model/course.model';
import { ProfessorModel } from '../model/professor.model';

export const getProfessors = async () => {
    console.log("In getProfessors");
    const professors = await ProfessorModel.find({});
    console.log('professors:::', professors);
    return professors;
}

export const getDeptProfessors = async (deptId: string) => {
    console.log("In getDeptProfessors");
    const professors = await ProfessorModel.find({departments: deptId});
    console.log('dept professors:::', professors);
    return professors;
}

export const getProfessor = async (name: string) => {
    console.log("In getProfessor");
    const professor = await ProfessorModel.findOne({name: name});
    const courses = await CourseModel.find({'offerings.professors': name})
    console.log("COURSES ARE ", courses);
    console.log('professor:::', professor);
    return {professor, courses};
}

export const createProfessor = async (professor: object) => {
    let data = {};
    try {
        console.log("In createProfessor");
        console.log('professor in create professor is: ', professor);
        console.log(ProfessorModel);
        data = await ProfessorModel.create(professor);
    } catch (err) {
        console.log('Error::' + err);
    }
    return data;
}

export const updateProfessor = async (id: string, professor: object) => {
    try {
        await ProfessorModel.findByIdAndUpdate(id, {
            professor: professor,
        }, { new: true }) as object;
        const updatedProfessor: object = await ProfessorModel.findById({ _id: id }) as object;
        return updatedProfessor;
    } catch (err) {
        console.log('Error::' + err);
    }
}

export const deleteProfessor = async (id: string) => {
    try {
        let professorDeleted: object = await ProfessorModel.findById(id) as object;
        let deletedCount: number = await (await ProfessorModel.deleteOne({ _id: id })).deletedCount;
        if (deletedCount === 1) {
            return { professorDeleted };
        }
    } catch (err) {
        console.log('Error::' + err);
    }
}