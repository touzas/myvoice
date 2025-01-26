export interface weeklyClass{
    day: string,
    classes: dailyClass[],
}
export interface dailyClass{
    startTime: number,
    endTime: number,
    className: string,
}

export const WeeklyClasses: weeklyClass[] = [
    {day: "Monday", classes: [
        {startTime: 9, endTime: 9.50, className: "Matemáticas"},
        {startTime: 9.50, endTime: 10.40, className: "Inglés"},
        {startTime: 10.40, endTime: 11.30, className: "Música"},
        {startTime: 11.30, endTime: 12.00, className: "Recreo"},
        {startTime: 12, endTime: 12.20, className: "Lectura"},
        {startTime: 12.20, endTime: 13.10, className: "Ámbito Lingüístico"},
        {startTime: 13.10, endTime: 14, className: "Ciencias"}
    ]},
    {day: "Tuesday", classes: [
        {startTime: 9, endTime: 9.50, className: "Matemáticas"},
        {startTime: 9.50, endTime: 10.40, className: "Inglés"},
        {startTime: 10.40, endTime: 11.30, className: "Música"},
        {startTime: 11.30, endTime: 12.00, className: "Recreo"},
        {startTime: 12, endTime: 12.20, className: "Lectura"},
        {startTime: 12.20, endTime: 13.10, className: "Ámbito Lingüístico"},
        {startTime: 13.10, endTime: 14, className: "Ciencias"}
    ]},
    {day: "Wednesday", classes: [
        {startTime: 9, endTime: 9.50, className: "Matemáticas"},
        {startTime: 9.50, endTime: 10.40, className: "Inglés"},
        {startTime: 10.40, endTime: 11.30, className: "Música"},
        {startTime: 11.30, endTime: 12.00, className: "Recreo"},
        {startTime: 12, endTime: 12.20, className: "Lectura"},
        {startTime: 12.20, endTime: 13.10, className: "Ámbito Lingüístico"},
        {startTime: 13.10, endTime: 14, className: "Ciencias"}
    ]},
    {day: "Thursday", classes: [
        {startTime: 10, endTime: 16, className: "Aspanaes"}
    ]},
    {day: "Friday", classes: [
        {startTime: 10, endTime: 16, className: "Aspanaes"}
    ]},
    {day: "Sunday", classes: [
        {startTime: 9, endTime: 9.50, className: "Matemáticas"},
        {startTime: 9.50, endTime: 10.40, className: "Inglés"},
        {startTime: 10.40, endTime: 11.30, className: "Música"},
        {startTime: 11.30, endTime: 12.00, className: "Recreo"},
        {startTime: 12, endTime: 12.20, className: "Lectura"},
        {startTime: 12.20, endTime: 13.10, className: "Ámbito Lingüístico"},
        {startTime: 13.10, endTime: 14, className: "Ciencias"}
    ]}
]