import React from 'react';
import styles from './styles.module.css';

// --- Helper Functions ---
const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
};

const getTaskStatus = (task, currentYearMonth) => {
    const startMonth = task.start.slice(0, 7);
    const endMonth = task.end.slice(0, 7);
    if (endMonth < currentYearMonth) return 'passed';
    if (startMonth <= currentYearMonth && endMonth >= currentYearMonth) return 'current';
    return 'next';
};

/**
 * Gets the English ordinal suffix for a day number (st, nd, rd, th).
 * @param {number} d The day of the month.
 * @returns {string} The ordinal suffix.
 */
const getOrdinalSuffix = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

/**
 * Formats a 'YYYY-MM-DD' string into 'Month Dayth, Year'.
 * @param {string} dateString The date string to format.
 * @returns {string} The formatted date.
 */
const formatDateForTable = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return 'Invalid Date';
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', {month: 'long'});
    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

/**
 * Determines the quarter for a given date string.
 * @param {string} dateString The date string to check.
 * @returns {string} The quarter in 'Qn - YYYY' format.
 */
const findQuarter = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return 'N/A';
    const month = date.getMonth();
    const year = date.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} - ${year}`;
};

// --- Main Component ---
export default function GanttChart({config, renderAs = 'chart'}) {
    if (!config || !config.tasks || (renderAs === 'chart' && !config.timeline)) {
        return <pre><code>{`Error: The 'config' prop is missing or invalid.`}</code></pre>;
    }

    // MODIFIED: Render a styled HTML table if specified
    if (renderAs === 'table') {
        return (
            <table>
                <thead>
                <tr>
                    <th>{`Quarter`}</th>
                    <th>{`Stable Version*`}</th>
                    <th>{`Start MTW`}</th>
                    <th>{`End MTW`}</th>
                </tr>
                </thead>
                <tbody>
                {config.tasks.map(task => (
                    <tr key={task.name}>
                        <td>{findQuarter(task.start)}</td>
                        <td>{task.name}</td>
                        <td>{formatDateForTable(task.start)}</td>
                        <td>{formatDateForTable(task.end)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    // --- Default: Render the visual Gantt Chart ---
    const allMonths = config.timeline.flatMap(q =>
        q.months.map((month) => {
            const monthIndex = new Date(Date.parse(month + " 1, 2012")).getMonth() + 1;
            return `${q.year}-${String(monthIndex).padStart(2, '0')}`;
        })
    );

    const currentYearMonth = getCurrentYearMonth();
    const totalMonths = allMonths.length;

    return (
        <div className={styles.ganttContainer}>
            <table className={styles.ganttTable}>
                <thead>
                <tr>
                    {config.timeline.map((q, index) => (
                        <th className={styles.quarterHeader} colSpan={q.months.length} key={index}>
                            {`${q.quarter} - ${q.year}`}
                        </th>
                    ))}
                </tr>
                <tr>
                    {config.timeline.flatMap((q) => q.months).map((month, index) => (
                        <th className={styles.monthHeader} key={index}>{month}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {config.tasks.map((task) => {
                    const startMonth = task.start.slice(0, 7);
                    const endMonth = task.end.slice(0, 7);
                    const startIndex = allMonths.indexOf(startMonth);
                    const endIndex = allMonths.indexOf(endMonth);

                    if (startIndex === -1 || endIndex === -1) {
                        return (
                            <tr key={task.name}>
                                <td className={styles.taskLabel}>{task.name}</td>
                                <td colSpan={totalMonths}>{`Invalid Date Range`}</td>
                            </tr>
                        );
                    }

                    const status = getTaskStatus(task, currentYearMonth);
                    const gridColumn = `${startIndex + 1} / ${endIndex + 2}`;

                    return (
                        <tr key={task.name}>
                            <td className={styles.barCell} colSpan={totalMonths}>
                                <div className={styles.barContainer} style={{'--total-months': totalMonths}}>
                                    <div className={`${styles.bar} ${styles[status]}`} style={{gridColumn}}>
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
