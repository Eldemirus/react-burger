export const checkAnswer = (response: Response) => {
    if (response.ok) {
        return response.json()
    } else {
        return response.json().then((error) => {
            Promise.reject(error)
        });
    }
}

export const checkSuccess = (answer: any) => {
    if (answer?.success) {
        return answer
    } else {
        return Promise.reject(answer);
    }
}