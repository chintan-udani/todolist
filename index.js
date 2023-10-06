const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Memento {
  constructor(tasks) {
    this.tasks = tasks;
  }
}

class Task {
  constructor(description, due_date = null, completed = false) {
    this.description = description;
    this.due_date = due_date;
    this.completed = completed;
  }
}

class TaskManager {
  constructor() {
    this.tasks = [];
    this.undoStack = [];
  }

  createMemento() {
    return new Memento(this.tasks.map(task => new Task(task.description, task.due_date, task.completed)));
  }

  setMemento(memento) {
    this.tasks = memento.tasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  markTaskAsCompleted(taskDescription) {
    this.saveUndoState();
    for (const task of this.tasks) {
      if (task.description === taskDescription) {
        task.completed = true;
      }
    }
  }

  markTaskAsPending(taskDescription) {
    this.saveUndoState();
    for (const task of this.tasks) {
      if (task.description === taskDescription) {
        task.completed = false;
      }
    }
  }

  deleteTask(taskDescription) {
    this.saveUndoState();
    this.tasks = this.tasks.filter(task => task.description !== taskDescription);
  }

  viewTasks(filterType = null) {
    if (filterType === "completed") {
      return this.tasks.filter(task => task.completed);
    } else if (filterType === "pending") {
      return this.tasks.filter(task => !task.completed);
    } else {
      return this.tasks;
    }
  }

  saveUndoState() {
    const memento = this.createMemento();
    this.undoStack.push(memento);
  }

  undo() {
    if (this.undoStack.length > 1) {
      this.undoStack.pop();
      const memento = this.undoStack[this.undoStack.length - 1];
      this.setMemento(memento);
      return true;
    }
    return false;
  }
}

function getDueDateFromUser(callback) {
  rl.question("Enter due date (YYYY-MM-DD, optional) or press Enter: ", dueDate => {
    if (!dueDate) {
      callback(null);
    } else {
      const date = new Date(dueDate);
      if (!isNaN(date.getTime())) {
        callback(date.toISOString().slice(0, 10));
      } else {
        console.log("Invalid date format. Please enter the date in YYYY-MM-DD format.");
        getDueDateFromUser(callback);
      }
    }
  });
}

function getUserChoice(callback) {
  rl.question("Enter your choice: ", choice => {
    if (/^[1-7]$/.test(choice)) {
      callback(Number(choice));
    } else {
      console.log("Invalid choice. Please enter a number between 1 and 7.");
      getUserChoice(callback);
    }
  });
}

function main() {
  const taskManager = new TaskManager();

  function menu() {
    console.log("\nMenu:");
    console.log("1. Add Task");
    console.log("2. Mark Task as Completed");
    console.log("3. Mark Task as Pending");
    console.log("4. Delete Task");
    console.log("5. View Tasks");
    console.log("6. Undo");
    console.log("7. Exit");

    getUserChoice(choice => {
      switch (choice) {
        case 1:
          rl.question("Enter task description: ", description => {
            getDueDateFromUser(dueDate => {
              const task = new Task(description, dueDate);
              taskManager.addTask(task);
              console.log("Task added successfully!");
              menu();
            });
          });
          break;
        case 2:
          rl.question("Enter task description to mark as completed: ", taskDescription => {
            taskManager.markTaskAsCompleted(taskDescription);
            console.log("Task marked as completed!");
            menu();
          });
          break;
        case 3:
          rl.question("Enter task description to mark as pending: ", taskDescription => {
            taskManager.markTaskAsPending(taskDescription);
            console.log("Task marked as pending!");
            menu();
          });
          break;
        case 4:
          rl.question("Enter task description to delete: ", taskDescription => {
            taskManager.deleteTask(taskDescription);
            console.log("Task deleted successfully!");
            menu();
          });
          break;
        case 5:
          rl.question("Enter filter type (all/completed/pending): ", filterType => {
            const tasks = taskManager.viewTasks(filterType.toLowerCase());
            tasks.forEach(task => {
              console.log(task.description, task.due_date, task.completed ? "Completed" : "Pending");
            });
            menu();
          });
          break;
        case 6:
          if (taskManager.undo()) {
            console.log("Undo successful!");
          } else {
            console.log("Unable to undo.");
          }
          menu();
          break;
        case 7:
          console.log("Exiting...");
          rl.close();
          break;
      }
    });
  }

  menu();
}

main();
