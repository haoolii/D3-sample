export const data = {
  task: "root",
  start: new Date("2020/08/20 01:00:00"),
  end: new Date("2020/08/20 23:00:00"),
  children: [
    {
      task: "Task1",
      start: new Date("2020/08/20 01:00:00"),
      end: new Date("2020/08/20 11:00:00"),
      children: [
        {
          task: "Task1-1",
          start: new Date("2020/08/20 01:00:00"),
          end: new Date("2020/08/20 05:00:00"),
        },
        {
          task: "Task1-2",
          start: new Date("2020/08/20 05:00:00"),
          end: new Date("2020/08/20 07:00:00"),
        },
        {
          task: "Task1-3",
          start: new Date("2020/08/20 07:00:00"),
          end: new Date("2020/08/20 11:00:00"),
        },
      ],
    },
    {
      task: "Task2",
      start: new Date("2020/08/20 11:00:00"),
      end: new Date("2020/08/20 23:00:00"),
      children: [
        {
          task: "Task2-1",
          start: new Date("2020/08/20 11:00:00"),
          end: new Date("2020/08/20 12:00:00"),
        },
        {
          task: "Task2-2",
          start: new Date("2020/08/20 12:00:00"),
          end: new Date("2020/08/20 20:00:00"),
        },
        {
          task: "Task2-3",
          start: new Date("2020/08/20 20:00:00"),
          end: new Date("2020/08/20 23:00:00"),
        },
      ],
    },
  ],
};

export const treeData = {
  name: "Top Level",
  children: [
    {
      name: "Level 2: A",
      children: [{ name: "Son of A" }, { name: "Daughter of A" }],
    },
    { name: "Level 2: B" },
  ],
};
