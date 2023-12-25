const initialState = {
    interactions: []
}

const chatbotReducer = (state = initialState, action) => {
    switch (action.type) {
        case "chat.append.message": {
            const interactions = [...state.interactions];
            interactions.push(action.payload)
            return {...state, interactions};
        }
        case "chat.reset": {
            return {...initialState, interactions: []}
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