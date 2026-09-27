const btn = document.querySelector("button") as HTMLButtonElement;
const input = document.querySelector("input") as HTMLInputElement;
const containerTasks = document.querySelector(".Tasks") as HTMLDivElement;

interface tasksData {
  id: number;
  title: string;
  time: string;
}

class Task<T extends tasksData> {
  private data: T[] = [];
  private static count: number = 0;

  private itemFn(task: tasksData): string {
    const item = `<div class='taskaya' serialId='${task.id}'>
                <p class='ids'>${Task.count}</p>
                <p class='theTask'>${task.title}</p>
                <span class='edit' serialId='${task.id}'>edit</span>
                <p class='delete' serialId='${task.id}'>X</p>
        </div>`;
    return item;
  }
  addTask(task: T): void {
    if (localStorage.tasks) {
      this.data = JSON.parse(localStorage.tasks);
    }
    this.data.push(task);
    localStorage.tasks = JSON.stringify(this.data);
    Task.count = JSON.parse(localStorage.tasks).length;
    containerTasks.innerHTML += this.itemFn(task);
    input.value = "";
  }
  loadTasks(): void {
    if (!localStorage.tasks) return;
    let tasks: T[] = JSON.parse(localStorage.tasks);
    tasks.reverse();
    tasks.forEach((task) => {
      Task.count++;
      containerTasks.innerHTML += this.itemFn(task);
    });
  }

  deleteTask(serial: number): void {
    let Data: T[] = JSON.parse(localStorage.tasks);
    Data = Data.filter((item) => item.id != serial);
    localStorage.tasks = JSON.stringify(Data);
    document.querySelector(`.taskaya[serialId="${serial}"]`)?.remove();
  }
  editTask(serial: number): void {
    let newValue: string | undefined = document.querySelector(
      `.taskaya[serialId="${serial}"] .theTask`,
    )?.textContent;
    let Data: T[] = JSON.parse(localStorage.tasks);

    Data.forEach((item) => {
      if (item.id === serial) {
        item.title = newValue ?? "";
      }
    });

    localStorage.tasks = JSON.stringify(Data);
  }
}

const newTask = new Task<tasksData>();


newTask.loadTasks();


btn.addEventListener("click", (e: Event) => {
  e.preventDefault();
  const ID: number = new Date().getTime();
  const value: string = input.value;
  const Time: string = `${new Date().getMonth() + 1} - ${new Date().getDate()} - ${new Date().getFullYear()}`;
  newTask.addTask({ id: ID, title: value, time: Time });
});

document.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement | null;
  const btnDelete = target?.closest(".delete") as HTMLElement | null;
  const btnedit = target?.closest(".edit") as HTMLElement | null;
  if (!target) return;

  const serialId =
    target.getAttribute("serialId") ?? target.getAttribute("serialid");
  if (btnDelete) {
    newTask.deleteTask(Number(serialId));
  } else if (btnedit) {
    document
      .querySelector(`.taskaya[serialId="${serialId}"] .theTask`)
      ?.setAttribute("contentEditable", "true");
  }
});

document.querySelectorAll(`.theTask`)?.forEach((element) => {
  element?.addEventListener("blur", function (): void {
    const ID = element.parentElement?.getAttribute("serialId");
    newTask.editTask(Number(ID));
  });
});
