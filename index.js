class appTask {
    static tasks = []

    async fetchTasks() {
        return await fetch('http://localhost:3000/tasks').then(res => res.json())
    }

    createTaskContainer(id) {
        const container = document.createElement('div')
        container.classList.add('task')
        container.id = `task-${id}`
        return container
    }

    createTaskName(id, name) {
        const span = document.createElement('span')
        span.classList.add('task-name')
        span.id = `name-${id}`
        span.textContent = `Tarefa: ${name}`
        return span
    }

    createTaskCheck(id) {
        const checkBox = document.createElement('input')
        checkBox.type = 'checkbox'
        checkBox.id = `check-box-${id}`
        return checkBox
    }

    createRemoveBtn(id) {
        const buttonRemove = document.createElement('button')
        buttonRemove.id = `btn-remove-${id}`
        buttonRemove.classList.add('btn-remove')
        buttonRemove.textContent = 'Remover'
        return buttonRemove
    }


    renderTasks(taskData) {
        const container = this.createTaskContainer(taskData.id)
        const name = this.createTaskName(taskData.id, taskData.name)
        const checkBox = this.createTaskCheck(taskData.id)
        const removeBtn = this.createRemoveBtn(taskData.id)
        removeBtn.addEventListener('click', async () => {
            await this.removeTask(taskData.id)
            removeBtn.parentElement.remove()
            const indexToRemove = appTask.tasks.findIndex((i) => i.id == taskData.id)
            appTask.tasks.splice(indexToRemove, 1)
            const selectedCheck = document.querySelectorAll('input[type="checkbox"]:checked').length
            const taskCheck = document.querySelector('#tasks-check')
            taskCheck.textContent = `Voce concluiu ${selectedCheck} atividade (s)`
        })

        container.append(name, checkBox, removeBtn)
        document.querySelector('#list_task').append(container)
    }

    renderTasksCheck() {
        const searchCheck = document.querySelector('#list_task').addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const selectedCheck = document.querySelectorAll('input[type="checkbox"]:checked').length
                const taskCheck = document.querySelector('#tasks-check')

                if (selectedCheck === 0) {
                    taskCheck.textContent = ''
                } else {
                    taskCheck.textContent = `Voce concluiu ${selectedCheck} atividade (s)`
                }
            }
        })
        return searchCheck
    }

    async setup() {
        const results = await this.fetchTasks()
        appTask.tasks.push(...results)
        appTask.tasks.forEach((task) => {
            this.renderTasks(task)
        })
    }

    async postTask() {
        document.querySelector('form').addEventListener('submit', async (ev) => {
            ev.preventDefault()
            const name = document.querySelector("#name_task").value

            const response = await fetch("http://localhost:3000/tasks", {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const task = await response.json()
            appTask.tasks.push(task)
            this.renderTasks(task)
            ev.target.reset()
        })
    }

    async removeTask(id) {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
        })
    }
}

const app = new appTask()
app.renderTasksCheck()
document.addEventListener('DOMContentLoaded', () => {
    app.postTask()
    app.setup()
})

