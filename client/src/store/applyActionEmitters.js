export default function applyActionEmitters(store) {
    return (...actionEmitters) => {
        var emitterAPI = {
            getState: store.getState,
            dispatch: (action) => store.dispatch(action)
        };

        actionEmitters.forEach(actionEmitter => {
            actionEmitter(emitterAPI);
        })
    }
}