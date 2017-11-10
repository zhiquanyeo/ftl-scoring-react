export const REGISTRATION = 'REGISTRATION';
export const registration = (id) => {
    return {
        type: REGISTRATION,
        payload: {
            id: id
        }
    }
};