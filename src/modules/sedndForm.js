const sendFormFunc = (formClass) => {
    const form = document.querySelector(formClass)

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        let data = {}

        for (let { name, value } of form.elements) {
            if (name) {
                data[name] = value
            }
        }

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    return response.json()
                } else {
                    throw new Error(response.status)
                }
            })
            .then(data => {
                alert('Данные успешно сохранены!')
                form.reset()
            })
            .catch(error => {
                alert('Произошла ошибка, статус ' + error.message)
            })
    })
}

export default sendFormFunc