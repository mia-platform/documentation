import React from 'react';
import styles from './styles.module.css';

// --- CONFIGURAZIONE JSON ---
// Modifica questo oggetto per personalizzare il tuo Gantt
const ganttData = {
    // Definisci le colonne del tempo
    timeline: [
        { year: 2024, quarter: 'Q4', months: ['Oct', 'Nov', 'Dec'] },
        { year: 2025, quarter: 'Q1', months: ['Jan', 'Feb', 'Mar'] },
        { year: 2025, quarter: 'Q2', months: ['Apr', 'May', 'Jun'] },
        { year: 2025, quarter: 'Q3', months: ['Jul', 'Ago', 'Sep'] },
        { year: 2025, quarter: 'Q4', months: ['Oct', 'Nov', 'Dec'] },
        { year: 2026, quarter: 'Q1', months: ['Jan', 'Feb', 'Mar'] },
    ],
    // Definisci le righe (task/versioni)
    tasks: [
        { name: 'v13.1.x', start: '2024-10', end: '2025-01' },
        { name: 'v13.3.x', start: '2025-01', end: '2025-04' },
        { name: 'v13.7.x', start: '2025-04', end: '2025-07' },
        { name: 'v14.0.x', start: '2025-07', end: '2025-10' },
        { name: 'v14.3.x', start: '2025-10', end: '2026-01' },
        // Aggiungi qui altre righe...
    ],
};
// -------------------------

// Funzione helper per ottenere la data corrente in formato 'YYYY-MM'
const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
};

// Funzione per determinare lo stato di un task
const getTaskStatus = (task, currentYearMonth) => {
    if (task.end < currentYearMonth) {
        return 'passed';
    }
    if (task.start <= currentYearMonth && task.end >= currentYearMonth) {
        return 'current';
    }
    return 'next';
};

export default function GanttChart() {
    const allMonths = ganttData.timeline.flatMap(q =>
        q.months.map((month) => {
            // Mappatura robusta del nome del mese al suo numero
            const monthIndex = new Date(Date.parse(month +" 1, 2012")).getMonth() + 1;
            return `${q.year}-${String(monthIndex).padStart(2, '0')}`;
        })
    );

    const currentYearMonth = getCurrentYearMonth();
    const totalMonths = allMonths.length; // Calcoliamo il numero totale di mesi

    return (
        <div className={styles.ganttContainer}>
            <table className={styles.ganttTable}>
                <thead>
                <tr>
                    <th className={styles.firstColHeader}></th>
                    {ganttData.timeline.map((q, index) => (
                        <th key={index} colSpan={q.months.length} className={styles.quarterHeader}>
                            {q.quarter} - {q.year}
                        </th>
                    ))}
                </tr>
                <tr>
                    <th className={styles.firstColHeader}></th>
                    {ganttData.timeline.flatMap((q) => q.months).map((month, index) => (
                        <th key={index} className={styles.monthHeader}>
                            {month}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {ganttData.tasks.map((task) => {
                    const startIndex = allMonths.indexOf(task.start);
                    const endIndex = allMonths.indexOf(task.end);

                    if (startIndex === -1 || endIndex === -1) {
                        return (
                            <tr key={task.name}>
                                <td className={styles.taskLabel}>{task.name}</td>
                                <td colSpan={totalMonths}>Data non valida</td>
                            </tr>
                        );
                    }

                    const status = getTaskStatus(task, currentYearMonth);
                    const gridColumn = `${startIndex + 1} / ${endIndex + 2}`;

                    return (
                        <tr key={task.name}>
                            <td className={styles.taskLabel}>{task.name}</td>

                            {/* La cella <td> usa la classe .barCell e contiene un <div> */}
                            <td colSpan={totalMonths} className={styles.barCell}>

                                {/* Questo <div> interno è il contenitore grid */}
                                <div
                                    className={styles.barContainer}
                                    style={{ '--total-months': totalMonths }}
                                >
                                    <div
                                        className={`${styles.bar} ${styles[status]}`}
                                        style={{ gridColumn }}
                                    >
                                        {task.name}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
