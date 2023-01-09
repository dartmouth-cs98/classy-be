import { OfferingModel } from '../model/offering.model';

export const getAllOfferings = async () => {
    console.log("In getOfferings");
    const offerings = await OfferingModel.find({});
    console.log('offerings:::', offerings);
    return offerings;
}

// for department filter
export const getDeptOfferings = async (dept: string) => {
    const query = {dept: dept};
    console.log("In getDeptOfferings");
    const offering = await OfferingModel.find(query);
    console.log('offering:::', offering);
    return offering;
}

// for course info page
export const getCourseOfferings = async (dept: string, num: string) => {
    const query = {dept: dept, num: num};
    console.log("In getCourseOfferings");
    const offering = await OfferingModel.find(query);
    console.log('offering:::', offering);
    return offering;
}

// for entire timetable
export const getTermOfferings = async (term: string) => {
    const query = {term: term};
    console.log("In getTermOfferings");
    const offering = await OfferingModel.find(query);
    console.log('offering:::', offering);
    return offering;
}

// get offerings for a course during a given term
export const getCourseTermOfferings = async (dept: string, num: string, term: string) => {
    const query = {dept: dept, num: num, term: term};
    console.log("In getCourseTermOfferings");
    const offering = await OfferingModel.find(query);
    console.log('offering:::', offering);
    return offering;
}

// get specific offering
export const getOffering = async (dept: string, num: string, term: string, period: string) => {
    const query = {dept: dept, num: num, term: term, period: period};
    console.log("In getOffering");
    const offering = await OfferingModel.find(query);
    console.log('offering:::', offering);
    return offering;
}

export const createOffering = async (offering: object) => {
    let data = {};
    try {
        console.log("In createOffering");
        console.log('offering in create offering is: ', offering);
        console.log(OfferingModel);
        data = await OfferingModel.create(offering);
    } catch (err) {
        console.log('Error::' + err);
    }
    return data;
}

export const updateOffering = async (dept: string, num: string, term: string, period: string, offering: object) => {
    try {
        const query = {dept: dept, num: num, term: term, period: period};
        await OfferingModel.findOneAndUpdate(query, {
            offering: offering,
        }, { new: true }) as object;
        const updatedOffering: object = await OfferingModel.findOne(query) as object;
        return updatedOffering;
    } catch (err) {
        console.log('Error::' + err);
    }
}

export const deleteOffering = async (dept: string, num: string, term: string, period: string) => {
    try {
        const query = {dept: dept, num: num, term: term, period: period};
        let offeringDeleted: object = await OfferingModel.findOne(query) as object;
        let deletedCount: number = await (await OfferingModel.deleteOne(query)).deletedCount;
        if (deletedCount === 1) {
            return { offeringDeleted };
        }
    } catch (err) {
        console.log('Error::' + err);
    }
}