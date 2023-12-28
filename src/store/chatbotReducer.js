const initialState = {
    interactions: [],
    finalizedComponents: {},
    searchOutput: {}
}

const chatbotReducer = (state = initialState, action) => {
    switch (action.type) {
        case "chat.append.message": {
            const interactions = [...state.interactions];
            interactions.push(action.payload)
            return {...state, interactions};
        }
        case "chat.reset": {
            return {...initialState, interactions: [], finalizedComponents: {}}
        }
        case "chat.components" : {
            return {...state, finalizedComponents: action.payload}
        }
        case "chat.search.output": {
            return {...state, searchOutput: action.payload}
        }
        default: 
        return state
    }
}

export default chatbotReducer

export const appendChat = (data, sender) => {
    return {
        type: "chat.append.message",
        payload: {sender, ...data, time: new Date().getTime()}
    }
}

export const resetChat = () => {
    return {
        type: "chat.reset"
    }
}

export const setFinalizedComponents = (data) => {
    return {
        type: "chat.components",
        payload: data
    }
}

export const setSearchOutput = (data) => {
    return {
        type: "chat.search.output",
        payload: data
    }
}