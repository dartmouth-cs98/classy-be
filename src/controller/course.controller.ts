import { CourseModel } from '../model/course.model';
import { DepartmentModel } from '../model/department.model';

export const getCourses = async () => {
    console.log("In getCourses");
    const courses = await CourseModel.find({});
    console.log('courses:::', courses);
    return courses;
}

export const getDeptCourses = async (dept: string) => {
    console.log("In getDeptCourses");
    const department = await DepartmentModel.findOne({codes: dept});
    const courses = await CourseModel.find({courseDept: dept}).sort({'courseNum': 1}).collation({locale: "en_US", numericOrdering: true});
    console.log('courses:::', courses);
    return {department, courses};
}

const shuffleArray = (array: []) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
  

export const getRandomCourses = async (num: number) => {
    console.log('In getRandomCourses');
    var selectedCourses = await CourseModel.find({});
    selectedCourses.slice(0, num);
    console.log('picked courses:::', selectedCourses);
    return selectedCourses;
}

export const getCourse = async (dept: string, num: string) => {
    console.log("In getCourse:", dept, num);
    console.log('all courses')
    const course = await CourseModel.findOne({"courseDept": dept, "courseNum": num});
    console.log('course:::', course);
    return course;
}

export const getProfessorCourses = async (profId: string) => {
    console.log("In getProfessorCourses");
    const courses = await CourseModel.find({professors: profId});
    console.log('professor courses:::', courses);
    return courses;
}

// use the same function for distrib and wc by specifying type
export const getDistribCourses = async (type: string, distrib: string) => {
    console.log("In getDistribCourses");
    let courses = null;
    if (type.toLowerCase() === "distrib" || type.toLowerCase() === "distribs") {
        courses = await CourseModel.find({distribs: distrib});
    } else if (type.toLowerCase() === "wc") {
        courses = await CourseModel.find({wc: distrib});
    } else {
        console.log("Sorry, your query was not recognized. Please specify whether you want to query by distrib or world culture (wc).")
    }
    console.log('distrib courses:::', distrib, courses);
    return courses;
}

export const createCourse = async (course: object) => {
    let data = {};
    try {
        console.log("In createCourse");
        console.log('course in create course is: ', course);
        console.log(CourseModel);
        data = await CourseModel.create(course);
    } catch (err) {
        console.log('Error::' + err);
    }
    return data;
}

export const updateCourse = async (id: string, course: object) => {
    try {
        await CourseModel.findByIdAndUpdate(id, {
            course: course,
        }, { new: true }) as object;
        const updatedCourse: object = await CourseModel.findById({ _id: id }) as object;
        return updatedCourse;
    } catch (err) {
        console.log('Error::' + err);
    }
}

export const deleteCourse = async (id: string) => {
    try {
        let courseDeleted: object = await CourseModel.findById(id) as object;
        let deletedCount: number = await (await CourseModel.deleteOne({ _id: id })).deletedCount;
        if (deletedCount === 1) {
            return { courseDeleted };
        }
    } catch (err) {
        console.log('Error::' + err);
    }
}