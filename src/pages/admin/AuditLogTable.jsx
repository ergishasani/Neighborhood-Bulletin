import React from "react";

export default function AuditLogTable({ logs }) {
    return (
        <table className="audit-log-table">
            <thead>
            <tr><th>Time</th><th>Action</th><th>Target</th></tr>
            </thead>
            <tbody>
            {logs.map(l=>(
                <tr key={l.id}>
                    <td>{new Date(l.timestamp.seconds*1000).toLocaleString()}</td>
                    <td>{l.action}</td>
                    <td>{l.targetUid}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
