export const checkAnswer = (response: Response) => {
    if (response.ok) {
        return response.json()
    } else {
        return response.json().then((error) => {
            Promise.reject(error)
        });
    }
}

