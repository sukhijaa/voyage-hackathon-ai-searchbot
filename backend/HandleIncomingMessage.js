import { APIcall } from "./OpenAIInteractor.js";

const INPUTS = [
    {
        "key": "startDate",
        "openAI": (message) => `tell me in one word start date in yyyy-mm-dd format mentioned in input - '${message}'`,
        "chatResponse": (message) => `Please select the Start Date`,
        "chatResponseData": {
            showOptions: true,
            dataType: "date",
            lte: "endDate"
        },
        dataChecker: (gptOutput, components) => {
            const date = new Date(gptOutput)
            const endTime = components?.endDate ? new Date(components.endDate) : new Date("2099-12-31")
            if (date && date > new Date() && date < endTime) {
                return true
            }
            return false
        }
    },
    {
        "key": "endDate",
        "openAI": (message) => `tell me in one word end date in yyyy-mm-dd format mentioned in input - '${message}'`,
        "chatResponse": (message) => `Please select the End Date`,
        "chatResponseData": {
            showOptions: true,
            dataType: "date",
            gte: "startDate"
        },
        dataChecker: (gptOutput, components) => {
            const date = new Date(gptOutput)
            const startTime = components?.startDate ? new Date(components.startDate) : new Date("2000-12-31")
            if (date && date > new Date() && date > startTime) {
                return true
            }
            return false
        }
    },
    {
        "key": "destination",
        "openAI": (message) => `tell me in one word what is destination city mentioned in input - '${message}' or simply say unknown`,
        "chatResponse": (message) => `Please select the destination city`,
        "chatResponseData": {
            showOptions: false
        },
        dataChecker: (gptOutput) => typeof gptOutput === "string" && gptOutput.toLowerCase() !== "unknonw"
    },
    {
        "key": "destinationAirport",
        "openAI": (message, components) => `tell me in one word what is destination airport code mentioned in input - '${components.destination}'`,
        "chatResponse": (message) => null,
        dataChecker: (gptOutput) => typeof gptOutput === "string" && gptOutput.length === 3
    },
]

const waitForTime = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}

export const handleUserInput = async (dataObj, writer) => {
    const {components: inputComponents, message, responseOptions} = dataObj;
    const components = {...(inputComponents || {})}

    let goToGPT = true;
    if (responseOptions && responseOptions.componentKey) {
        components[responseOptions.componentKey] = message;
        goToGPT = false;
    }

    for (let i = 0; i < INPUTS.length && goToGPT; i++) {
        const invalidComponent = INPUTS[i];
        if (components[invalidComponent.key]) {
            continue
        }

        const gptResponse = await APIcall(invalidComponent.openAI(message, components));
        console.log(gptResponse)
        if (gptResponse === "##retry##") {
            writer({
                type: "chat",
                message: "Since We're using Free Version of ChatGPT, we'll need to wait 60s more. Sorry for inconveniecne"
            })
            await waitForTime(60)
            i--;
            continue;
        }

        if (gptResponse && invalidComponent.dataChecker(gptResponse, components)) {
            components[invalidComponent.key] = gptResponse;
        }
    }

    const invalidComponent = INPUTS.find(obj => !components[obj.key])

    if (!invalidComponent) {
        writer({
            type: "chat",
            message: "All inputs have been processed. Creating your personalized itinerary now",
            components,
            isFinished: true
        })
        return
    }

    writer({
        type: "chat",
        message: invalidComponent.chatResponse(message),
        components,
        responseOptions: {...(invalidComponent.chatResponseData || {}), componentKey: invalidComponent.key}
    })
}